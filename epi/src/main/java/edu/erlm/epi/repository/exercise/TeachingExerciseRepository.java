package edu.erlm.epi.repository.exercise;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import edu.erlm.epi.domain.exercise.TeachingExercise;

public interface TeachingExerciseRepository extends JpaRepository<TeachingExercise, Long>, JpaSpecificationExecutor<TeachingExercise> {

	List<TeachingExercise> findByStatusAndStudents_Login(TeachingExercise.Status status, String login);

	List<TeachingExercise> findByStatusAndTeachers_Login(TeachingExercise.Status status, String login);
	
	List<TeachingExercise> findByStatus(TeachingExercise.Status status);
	
	TeachingExercise findById(Long id);
	
}
