
package edu.erlm.epi.service;

import java.time.LocalDate;

import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.erlm.epi.domain.Authority;
import edu.erlm.epi.domain.User;
import edu.erlm.epi.domain.exercise.TeachingExercise;
import edu.erlm.epi.domain.school.Admin;
import edu.erlm.epi.domain.school.Student;
import edu.erlm.epi.domain.school.Teacher;
import edu.erlm.epi.repository.AuthorityRepository;
import edu.erlm.epi.repository.PersistentTokenRepository;
import edu.erlm.epi.repository.SearchSpecification;
import edu.erlm.epi.repository.UserRepository;
import edu.erlm.epi.repository.exercise.TeachingExerciseRepository;
import edu.erlm.epi.security.AuthoritiesConstants;
import edu.erlm.epi.repository.school.StudentRepository;
import edu.erlm.epi.security.SecurityUtils;
import edu.erlm.epi.service.util.RandomUtil;
import edu.erlm.epi.web.rest.dto.ManagedUserDTO;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    @Inject
    private PasswordEncoder passwordEncoder;

    @Inject
    private UserRepository userRepository;
    
    @Inject
    private StudentRepository studentRepository;
    
    @Inject
    private  TeachingExerciseRepository teachingExerciseRepository;

    @Inject
    private PersistentTokenRepository persistentTokenRepository;

    @Inject
    private AuthorityRepository authorityRepository;

    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        userRepository.findOneByActivationKey(key)
            .map(user -> {
                // activate given user for the registration key.
                user.setActivated(true);
                user.setActivationKey(null);
                userRepository.save(user);
                log.debug("Activated user: {}", user);
                return user;
            });
        return Optional.empty();
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
       log.debug("Reset user password for reset key {}", key);

       return userRepository.findOneByResetKey(key)
            .filter(user -> {
                ZonedDateTime oneDayAgo = ZonedDateTime.now().minusHours(24);
                return user.getResetDate().isAfter(oneDayAgo);
           })
           .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                userRepository.save(user);
                return user;
           });
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository.findOneByEmail(mail)
            .filter(User::getActivated)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(ZonedDateTime.now());
                userRepository.save(user);
                return user;
            });
    }

    public User createUserInformation(String login, String password, String firstName, String lastName, String email,
        String langKey) {

        User newUser = new User();
        Authority authority = authorityRepository.findOne("ROLE_USER");
        Set<Authority> authorities = new HashSet<>();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(login);
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(firstName);
        newUser.setLastName(lastName);
        newUser.setEmail(email);
        newUser.setLangKey(langKey);
        // new user is not active
        newUser.setActivated(false);
        // new user gets registration key
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        authorities.add(authority);
        newUser.setAuthorities(authorities);
        userRepository.save(newUser);
        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }

    public User createUser(ManagedUserDTO managedUserDTO) {
    	 User user = new User();
    	if (managedUserDTO.getAuthorities() != null) {
    		if (managedUserDTO.getAuthorities().contains(AuthoritiesConstants.ADMIN)){
    			user = new Admin();
    		}else if (managedUserDTO.getAuthorities().contains(AuthoritiesConstants.TEACHER)){
    			user = new Teacher();
    		}else if (managedUserDTO.getAuthorities().contains(AuthoritiesConstants.STUDENT)){
    			user = new Student();
    		}
    		
            Set<Authority> authorities = new HashSet<>();
            managedUserDTO.getAuthorities().stream().forEach(
                authority -> authorities.add(authorityRepository.findOne(authority))
            );
            user.setAuthorities(authorities);
        }
    	
       
        user.setLogin(managedUserDTO.getLogin());
        user.setFirstName(managedUserDTO.getFirstName());
        user.setLastName(managedUserDTO.getLastName());
        user.setEmail(managedUserDTO.getEmail());
        user.setLangKey(managedUserDTO.getLangKey() == null ? "fr" : managedUserDTO.getLangKey()); // default language is french
        
        String encryptedPassword = passwordEncoder.encode(StringUtils.isEmpty(managedUserDTO.getPassword()) ? RandomUtil.generatePassword(): managedUserDTO.getPassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(ZonedDateTime.now());
        user.setActivated(managedUserDTO.isActivated());
        userRepository.save(user);
        log.debug("Created Information for User: {}", user);
        return user;
    }

    public void updateUserInformation(String firstName, String lastName, String email, String langKey) {
        userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).ifPresent(u -> {
            u.setFirstName(firstName);
            u.setLastName(lastName);
            u.setEmail(email);
            u.setLangKey(langKey);
            userRepository.save(u);
            log.debug("Changed Information for User: {}", u);
        });
    }

    public void deleteUserInformation(String login) {
        userRepository.findOneByLogin(login).ifPresent(u -> {
            userRepository.delete(u);
            log.debug("Deleted User: {}", u);
        });
    }

    public void changeUserPassword(String login, String password) {
        userRepository.findOneByLogin(login).ifPresent(u -> {
            String encryptedPassword = passwordEncoder.encode(password);
            u.setPassword(encryptedPassword);
            userRepository.save(u);
            log.debug("Changed password for User: {}", u.getLogin());
        });
    }
    
    public void changeCurrentUserPassword(String password) {
        userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).ifPresent(u -> {
            String encryptedPassword = passwordEncoder.encode(password);
            u.setPassword(encryptedPassword);
            userRepository.save(u);
            log.debug("Changed password for User: {}", u.getLogin());
        });
    }

	public void setTeachingExerciseAsMarkedForRead(Long id){
		TeachingExercise teachingExercise = teachingExerciseRepository.findOne(id);
		User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get(); 
		if(teachingExercise != null){
			List<TeachingExercise> teachingExercises = currentUser.getTeachingExercisesMarkedForRead(); 
			teachingExercises.add(teachingExercise);
			userRepository.save(currentUser);
		}
	}
	
	
	    public User getCurrentUserWithoutAuthorities() {
		 User currentUser = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get(); 
		 return currentUser;
	    }
    
    
    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneByLogin(login).map(u -> {
            u.getAuthorities().size();
            return u;
        });
    }

    @Transactional(readOnly = true)
    public User getUserWithAuthorities(Long id) {
        User user = userRepository.findOne(id);
        user.getAuthorities().size(); // eagerly load the association
        return user;
    }

    @Transactional(readOnly = true)
    public User getUserWithAuthorities() {
        User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUser().getUsername()).get();
        user.getAuthorities().size(); // eagerly load the association
        return user;
    }
    
    public Page<User> search(User userSearchModel, Pageable pageable){
    	SearchSpecification<User> userSearchSpec = new SearchSpecification<>();
		Specification<User> spec = userSearchSpec.find(userSearchModel);
		Page<User> page = userRepository.findAll(spec, pageable); 
		return page;
    }
    
    public Page<Student> searchStudents(String searchText, Pageable pageable){
    	if(searchText == null){
    		searchText = StringUtils.EMPTY; 
    	}
    	searchText = searchText.trim(); 
		return studentRepository.search(searchText, pageable);
    }
    

    /**
     * Persistent Token are used for providing automatic authentication, they should be automatically deleted after
     * 30 days.
     * <p/>
     * <p>
     * This is scheduled to get fired everyday, at midnight.
     * </p>
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void removeOldPersistentTokens() {
        LocalDate now = LocalDate.now();
        persistentTokenRepository.findByTokenDateBefore(now.minusMonths(1)).stream().forEach(token -> {
            log.debug("Deleting token {}", token.getSeries());
            User user = token.getUser();
            user.getPersistentTokens().remove(token);
            persistentTokenRepository.delete(token);
        });
    }

    /**
     * Not activated users should be automatically deleted after 3 days.
     * <p/>
     * <p>
     * This is scheduled to get fired everyday, at 01:00 (am).
     * </p>
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void removeNotActivatedUsers() {
        ZonedDateTime now = ZonedDateTime.now();
        List<User> users = userRepository.findAllByActivatedIsFalseAndCreatedDateBefore(now.minusDays(3));
        for (User user : users) {
            log.debug("Deleting not activated user {}", user.getLogin());
            userRepository.delete(user);
        }
    }
}
 
