package edu.erlm.epi.repository.exercise;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.erlm.epi.domain.exercise.File;
import edu.erlm.epi.domain.exercise.MediaLink;

public interface MediaLinkRepository extends JpaRepository<MediaLink, Long> {

	@Query("select mediaLink from MediaLink mediaLink where mediaLink.teachingExerciseId = :teachingExerciseId")
	List<MediaLink> findByTeachingExerciseId(@Param("teachingExerciseId")Long teachingExerciseId);
}
