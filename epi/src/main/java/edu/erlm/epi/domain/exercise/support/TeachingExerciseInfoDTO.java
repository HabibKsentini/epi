package edu.erlm.epi.domain.exercise.support;

import java.time.LocalDateTime;

import java.util.List;
import java.util.stream.Collectors;

import edu.erlm.epi.domain.exercise.TeachingExercise;
import edu.erlm.epi.domain.school.Discipline;
import edu.erlm.epi.domain.school.Teacher;
import edu.erlm.epi.domain.school.Topic;
import edu.erlm.epi.web.rest.dto.UserDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Getter
@Setter
@ToString
@Slf4j
public class TeachingExerciseInfoDTO {

	private Long id;
	private String subject;
	private Topic topic;
	private String disciplines;
	private GroupDTO group;
	private String status;
	private LocalDateTime validatedAt;

	public static TeachingExerciseInfoDTO valueOf(TeachingExercise teachingExercise) {
		TeachingExerciseInfoDTO teachingExerciseDTO = new TeachingExerciseInfoDTO();
		teachingExerciseDTO.setId(teachingExercise.getId());
		teachingExerciseDTO.setSubject(teachingExercise.getSubject());
		teachingExerciseDTO.setTopic(teachingExercise.getTopic());
		teachingExerciseDTO.setDisciplines(convertDisciplines(teachingExercise.getDisciplines()));
		teachingExerciseDTO.setGroup(GroupDTO.valueOf(teachingExercise.getGroup()));
		teachingExerciseDTO.setStatus(teachingExercise.getStatus().toString());
		teachingExerciseDTO.setValidatedAt(teachingExercise.getValidatedAt());
		return teachingExerciseDTO;
	}

	public static List<TeachingExerciseInfoDTO> valueOf(List<TeachingExercise> teachingExercises) {
		return teachingExercises.stream().map(TeachingExerciseInfoDTO::valueOf).collect(Collectors.toList());
	}

	private static String convertDisciplines(List<Discipline> disciplines) {
		StringBuilder stringBuilder = new StringBuilder();
		for (Discipline discipline : disciplines) {
			stringBuilder.append(discipline.getName()).append(" ,");
		}
		if (stringBuilder.length() != 0) {
			stringBuilder.deleteCharAt(stringBuilder.length() - 1); // delete
																	// last
																	// comma
		}
		return stringBuilder.toString();
	}
	
	

}
