package edu.erlm.epi.repository.exercise;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.erlm.epi.domain.exercise.File;

public interface FileRepository extends JpaRepository<File, Long> {

	@Query("select file from File file where file.teachingExerciseId = :teachingExerciseId")
	List<File> findByTeachingExerciseId(@Param("teachingExerciseId")Long teachingExerciseId);
}
