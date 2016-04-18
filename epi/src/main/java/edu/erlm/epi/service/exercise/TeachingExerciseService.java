package edu.erlm.epi.service.exercise;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.erlm.epi.domain.User;
import edu.erlm.epi.domain.exercise.File;
import edu.erlm.epi.domain.exercise.TeachingExercise;
import edu.erlm.epi.domain.exercise.support.TeachingExerciseInfoDTO;
import edu.erlm.epi.domain.school.Teacher;
import edu.erlm.epi.exception.TechnicalException;
import edu.erlm.epi.repository.SearchSpecification;
import edu.erlm.epi.repository.UserRepository;
import edu.erlm.epi.repository.exercise.FileRepository;
import edu.erlm.epi.repository.exercise.TeachingExerciseRepository;
import edu.erlm.epi.repository.school.TopicRepository;
import edu.erlm.epi.security.SecurityUtils;
import edu.erlm.epi.web.rest.dto.TeachingExerciseDTO;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class TeachingExerciseService {

	@Autowired
	TeachingExerciseRepository teachingExerciseRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	TopicRepository topicRepository;

	@Autowired
	FileRepository fileRepository;

	@Transactional(readOnly = true)
	public List<TeachingExerciseInfoDTO> getListExerciseInPreparation() {
		List<TeachingExerciseInfoDTO> teachingExerciseDTOs = new ArrayList<>();
		List<TeachingExercise> teachingExercises;
		TeachingExercise.Status status = TeachingExercise.Status.IN_PREPARATION;
		String currentUserLogin = SecurityUtils.getCurrentUserLogin();
		if (SecurityUtils.isCurrentUserInRole(SecurityUtils.STUDENT_ROLE)) {
			teachingExercises = teachingExerciseRepository.findByStatusAndStudents_Login(status, currentUserLogin);
		} else if (SecurityUtils.isCurrentUserInRole(SecurityUtils.TEACHER_ROLE)) {
			teachingExercises = teachingExerciseRepository.findByStatusAndTeachers_Login(status, currentUserLogin);
		} else {
			teachingExercises = teachingExerciseRepository.findByStatusAndStudents_Login(status, currentUserLogin);
		}
		teachingExerciseDTOs = TeachingExerciseInfoDTO.valueOf(teachingExercises);
		return teachingExerciseDTOs;
	}

	@Transactional(readOnly = true)
	public List<TeachingExerciseInfoDTO> getListExerciseWaitingForValidation() {
		List<TeachingExerciseInfoDTO> teachingExerciseDTOs = new ArrayList<>();
		TeachingExercise.Status status = TeachingExercise.Status.WAITING_FOR_VALIDATION;
		String currentUserLogin = SecurityUtils.getCurrentUserLogin();
		if (SecurityUtils.isCurrentUserInRole(SecurityUtils.TEACHER_ROLE)) {
			List<TeachingExercise> teachingExercises = teachingExerciseRepository.findByStatusAndTeachers_Login(status,
					currentUserLogin);
			teachingExerciseDTOs = TeachingExerciseInfoDTO.valueOf(teachingExercises);
		}
		return teachingExerciseDTOs;
	}
	//TODO Yassine : j'ai rajouté cette méthode pour avoir les EPI que l'user en cours doit valider !
	// il faut le modifier et gérer aussi car plusieurs Profs peuvent valider le meme thème (cas d'un backup).
	@Transactional(readOnly = true)
	public List<TeachingExerciseInfoDTO> getListExerciseWaitingForCurrentUserValidation() {
		List<TeachingExerciseInfoDTO> teachingExerciseDTOs = new ArrayList<>();
		TeachingExercise.Status status = TeachingExercise.Status.WAITING_FOR_VALIDATION;
		String currentUserLogin = SecurityUtils.getCurrentUserLogin();
		if (SecurityUtils.isCurrentUserInRole(SecurityUtils.TEACHER_ROLE)) {
			List<TeachingExercise> teachingExercisesToValidate = teachingExerciseRepository.findByStatus(status);
			List<TeachingExercise> teachingExercises = new ArrayList<TeachingExercise>();
			for (TeachingExercise te :teachingExercisesToValidate){
				if (te.getTopic().getValidators() != null && te.getTopic().getValidators().get(0).getLogin().equalsIgnoreCase(currentUserLogin))
					teachingExercises.add(te);
			}
			teachingExerciseDTOs = TeachingExerciseInfoDTO.valueOf(teachingExercises);
		}
		return teachingExerciseDTOs;
	}

	@Transactional(readOnly = true)
	public Page<TeachingExerciseInfoDTO> search(TeachingExercise teachingExercise, Pageable pageable) {
		SearchSpecification<TeachingExercise> teachingExerciseSearchSpec = new SearchSpecification<>();
		Specification<TeachingExercise> spec = teachingExerciseSearchSpec.find(teachingExercise);
		Page<TeachingExercise> page = teachingExerciseRepository.findAll(spec, pageable); 
		Page<TeachingExerciseInfoDTO> convertedPage =  page.map(TeachingExerciseInfoDTO::valueOf); 
		return convertedPage;
	}

	@Transactional(readOnly = true)
	public List<TeachingExerciseInfoDTO> getListExercise() {
		List<TeachingExerciseInfoDTO> teachingExercises = getListExerciseInPreparation();
		teachingExercises.addAll(getListExerciseWaitingForValidation());
		teachingExercises.addAll(getListExerciseWaitingForCurrentUserValidation());
		return teachingExercises;
	}

	@Transactional(readOnly = true)
	public TeachingExerciseDTO getOne(Long id) {
		TeachingExercise teachingExercise = teachingExerciseRepository.getOne(id);
		teachingExercise.getStudents().size();
		teachingExercise.getTeachers().size();
		teachingExercise.getDisciplines().size();
		Teacher validator = null;

		if (teachingExercise.getFollowers().size() > 0) {
			List<User> followers = teachingExercise.getFollowers().stream()
					.filter(follower -> follower.getLogin().equals(SecurityUtils.getCurrentUser().getUsername()))
					.collect(Collectors.toList());
			if (followers.size() > 0) {
				teachingExercise.setMarkedForReadByTheCurrentUser(true);
			}
		}

		if (teachingExercise.getTopic() != null) {
			validator = teachingExercise.getTopic().getValidators().get(0);
		} else {
			throw new TechnicalException("no validator for the topic: " + teachingExercise.getTopic(), null);
		}
		TeachingExerciseDTO teachingExerciseDTO = new TeachingExerciseDTO(teachingExercise, validator);
		return teachingExerciseDTO;
	}

	@Transactional(readOnly = true)
	public List<TeachingExerciseInfoDTO> getMarkedForReadExercise() {
		User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
		List<TeachingExercise> exercises = user.getTeachingExercisesMarkedForRead();
		return TeachingExerciseInfoDTO.valueOf(exercises);
	}

	public void validate(Long teachingExerciseId) {
		TeachingExercise te = teachingExerciseRepository.findOne(teachingExerciseId);
		User user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).get();
		te.setValidator(user);
		TeachingExercise.Status vaildateStatus = TeachingExercise.Status.VALIDATED;
		te.setStatus(vaildateStatus);
		te.setValidatedAt(LocalDateTime.now());
		teachingExerciseRepository.save(te);
	}

	public void goToWaitingForValidation(Long teachingExerciseId) {
		TeachingExercise te = teachingExerciseRepository.findOne(teachingExerciseId);
		TeachingExercise.Status vaildateStatus = TeachingExercise.Status.WAITING_FOR_VALIDATION;
		te.setStatus(vaildateStatus);
		teachingExerciseRepository.save(te);
	}

	public void delete(Long teachingExerciseId) {
		List<File> files = fileRepository.findByTeachingExerciseId(teachingExerciseId);
		// remove all files
		for (File file : files) {
			fileRepository.delete(file);
		}
		teachingExerciseRepository.delete(teachingExerciseId);
	}
	


}
