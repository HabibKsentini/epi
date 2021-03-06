
package edu.erlm.epi.web.rest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.codahale.metrics.annotation.Timed;

import edu.erlm.epi.domain.Authority;
import edu.erlm.epi.domain.User;
import edu.erlm.epi.domain.school.Student;
import edu.erlm.epi.repository.AuthorityRepository;
import edu.erlm.epi.repository.UserRepository;
import edu.erlm.epi.security.AuthoritiesConstants;
import edu.erlm.epi.service.MailService;
import edu.erlm.epi.service.UserService;
import edu.erlm.epi.web.rest.dto.ManagedUserDTO;
import edu.erlm.epi.web.rest.util.HeaderUtil;
import edu.erlm.epi.web.rest.util.PaginationUtil;

/**
 * REST controller for managing users.
 *
 * <p>
 * This class accesses the User entity, and needs to fetch its collection of
 * authorities.
 * </p>
 * <p>
 * For a normal use-case, it would be better to have an eager relationship
 * between User and Authority, and send everything to the client side: there
 * would be no DTO, a lot less code, and an outer-join which would be good for
 * performance.
 * </p>
 * <p>
 * We use a DTO for 3 reasons:
 * <ul>
 * <li>We want to keep a lazy association between the user and the authorities,
 * because people will quite often do relationships with the user, and we don't
 * want them to get the authorities all the time for nothing (for performance
 * reasons). This is the #1 goal: we should not impact our users' application
 * because of this use-case.</li>
 * <li>Not having an outer join causes n+1 requests to the database. This is not
 * a real issue as we have by default a second-level cache. This means on the
 * first HTTP call we do the n+1 requests, but then all authorities come from
 * the cache, so in fact it's much better than doing an outer join (which will
 * get lots of data from the database, for each HTTP call).</li>
 * <li>As this manages users, for security reasons, we'd rather have a DTO
 * layer.</li>
 * </p>
 * <p>
 * Another option would be to have a specific JPA entity graph to handle this
 * case.
 * </p>
 */
@RestController
@RequestMapping("/api")
public class UserResource {

	private final Logger log = LoggerFactory.getLogger(UserResource.class);

	@Inject
	private UserRepository userRepository;

	@Inject
	private MailService mailService;

	@Inject
	private AuthorityRepository authorityRepository;

	@Inject
	private UserService userService;

	/**
	 * POST /users -> Creates a new user.
	 * <p>
	 * Creates a new user if the login and email are not already used, and sends
	 * an mail with an activation link. The user needs to be activated on
	 * creation.
	 * </p>
	 */
	@RequestMapping(value = "/users", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	@Secured(AuthoritiesConstants.ADMIN)
	public ResponseEntity<?> createUser(@RequestBody ManagedUserDTO managedUserDTO, HttpServletRequest request)
			throws URISyntaxException {
		log.debug("REST request to save User : {}", managedUserDTO);
		if (userRepository.findOneByLogin(managedUserDTO.getLogin()).isPresent()) {
			return ResponseEntity.badRequest()
					.headers(HeaderUtil.createFailureAlert("user-management", "userexists", "Login already in use"))
					.body(null);
		}else {
			User newUser = userService.createUser(managedUserDTO);
			String baseUrl = request.getScheme() + // "http"
					"://" + // "://"
					request.getServerName() + // "myhost"
					":" + // ":"
					request.getServerPort() + // "80"
					request.getContextPath(); // "/myContextPath" or "" if
												// deployed in root context
			mailService.sendCreationEmail(newUser, baseUrl);
			return ResponseEntity.created(new URI("/api/users/" + newUser.getLogin()))
					.headers(HeaderUtil.createAlert("user-management.created", newUser.getLogin())).body(newUser);
		}
	}

	/**
	 * PUT /users -> Updates an existing User.
	 */
	@RequestMapping(value = "/users", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	@Transactional
	@Secured(AuthoritiesConstants.ADMIN)
	public ResponseEntity<ManagedUserDTO> updateUser(@RequestBody ManagedUserDTO managedUserDTO)
			throws URISyntaxException {
		log.debug("REST request to update User : {}", managedUserDTO);
		Optional<User> existingUser = userRepository.findOneByEmail(managedUserDTO.getEmail());
		existingUser = userRepository.findOneByLogin(managedUserDTO.getLogin());
		if (existingUser.isPresent() && (!existingUser.get().getId().equals(managedUserDTO.getId()))) {
			return ResponseEntity.badRequest()
					.headers(HeaderUtil.createFailureAlert("user-management", "userexists", "Login already in use"))
					.body(null);
		}
		return userRepository.findOneById(managedUserDTO.getId()).map(user -> {
			user.setLogin(managedUserDTO.getLogin());
			user.setFirstName(managedUserDTO.getFirstName());
			user.setLastName(managedUserDTO.getLastName());
			user.setActivated(managedUserDTO.isActivated());
			user.setLangKey(managedUserDTO.getLangKey());
			Set<Authority> authorities = user.getAuthorities();
			authorities.clear();
			managedUserDTO.getAuthorities().stream()
					.forEach(authority -> authorities.add(authorityRepository.findOne(authority)));
			return ResponseEntity.ok()
					.headers(HeaderUtil.createAlert("user-management.updated", managedUserDTO.getLogin()))
					.body(new ManagedUserDTO(userRepository.findOne(managedUserDTO.getId())));
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));

	}

	/**
	 * GET /users -> get all users.
	 */
	@RequestMapping(value = "/users", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	@Transactional(readOnly = true)
	public ResponseEntity<List<ManagedUserDTO>> getAllUsers(User userSearchModel, Pageable pageable) throws URISyntaxException {
		Page<User> page = userService.search(userSearchModel, pageable);
		List<ManagedUserDTO> managedUserDTOs = page.getContent().stream().map(user -> new ManagedUserDTO(user))
				.collect(Collectors.toList());
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/users");
		return new ResponseEntity<>(managedUserDTOs, headers, HttpStatus.OK);
	}
	
	/**
	 * GET /users -> get all users.
	 */
	@RequestMapping(value = "/students", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	@Transactional(readOnly = true)
	public ResponseEntity<List<Student>> getAllUsers(String searchText, Pageable pageable) throws URISyntaxException {
		Page<Student> page = userService.searchStudents(searchText, pageable);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/students");
		return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
	}
	

	/**
	 * GET /users/:login -> get the "login" user.
	 */
	@RequestMapping(value = "/users/{login:[_'.@a-z0-9-]+}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<ManagedUserDTO> getUser(@PathVariable String login) {
		log.debug("REST request to get User : {}", login);
		return userService.getUserWithAuthoritiesByLogin(login).map(ManagedUserDTO::new)
				.map(managedUserDTO -> new ResponseEntity<>(managedUserDTO, HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	/**
	 * DELETE USER :login -> delete the "login" User.
	 */
	@RequestMapping(value = "/users/{login}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	@Secured(AuthoritiesConstants.ADMIN)
	public ResponseEntity<Void> deleteUser(@PathVariable String login) {
		log.debug("REST request to delete User: {}", login);
		userService.deleteUserInformation(login);
		return ResponseEntity.ok().headers(HeaderUtil.createAlert("user-management.deleted", login)).build();
	}
	
	
	/**
	 * LOAD USERS FROM FILE : file -> add all Users.
	 */
	@RequestMapping(value = "/loadusers", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	@Secured(AuthoritiesConstants.ADMIN)
	public ResponseEntity<?> loadUserfromFile(@RequestParam("file") MultipartFile multipartFile, HttpServletRequest request)
			throws URISyntaxException {
		log.debug("REST request to add User from file : {}", multipartFile.getOriginalFilename());

		InputStream inputStream;
		try {
			inputStream = multipartFile.getInputStream();

			BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));

			String line;
			User newUser = null;
			while ((line = bufferedReader.readLine()) != null)
			{
				if (!line.isEmpty()){
					String [] userInfos = line.split(";");
					Set<String> authorities = new HashSet<String>(Arrays.asList(userInfos[7].split(",")));
					// user processing       
					ManagedUserDTO managedUserDTO = new ManagedUserDTO(userInfos[1], // login
							userInfos[2] , //password, 
							userInfos[3] , //firstName, 
							userInfos[4] , //lastName, 
							userInfos[5] , //email, 
							!userInfos[6].startsWith("N") , //activated (if not 'N' ), 
							"fr" , //langKey, 
							authorities);

					if (!userRepository.findOneByLogin(managedUserDTO.getLogin()).isPresent() 
							&& !userRepository.findOneByEmail(managedUserDTO.getEmail()).isPresent()) {
						newUser = userService.createUser(managedUserDTO);
						String baseUrl = request.getScheme() + // "http"
								"://" + // "://"
								request.getServerName() + // "myhost"
								":" + // ":"
								request.getServerPort() + // "80"
								request.getContextPath(); // "/myContextPath" or "" if
						// deployed in root context
						mailService.sendCreationEmail(newUser, baseUrl);

					}
				}
			}
			return ResponseEntity.created(new URI("/api/users/" + newUser.getLogin()))
					.headers(HeaderUtil.createAlert("user-management.created", newUser.getLogin())).body(newUser);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest()
					.headers(HeaderUtil.createFailureAlert("user-management", "LoadFileError", "Error Loading User from File"))
					.body(null);		
			}
	}
}

