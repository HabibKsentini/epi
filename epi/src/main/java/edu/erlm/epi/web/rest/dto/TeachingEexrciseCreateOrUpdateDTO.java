package edu.erlm.epi.web.rest.dto;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.util.CollectionUtils;

import edu.erlm.epi.domain.exercise.TeachingExercise;
import edu.erlm.epi.domain.school.Discipline;
import edu.erlm.epi.domain.school.Group;
import edu.erlm.epi.domain.school.Student;
import edu.erlm.epi.domain.school.Teacher;
import edu.erlm.epi.domain.school.Topic;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Setter
@Slf4j
public class TeachingEexrciseCreateOrUpdateDTO {

	private Long id;
	private String subject;
	private String rawContent;
	private Long topicId;
	private List<Long> teacherIds;
	private List<Long> studentIds;
	private Long groupId;
	private List<Long> disciplineIds;
	private List<String> mediaUrls;

	public static TeachingExercise convertToTeachingExercise(
			TeachingEexrciseCreateOrUpdateDTO teachingEexrciseCreateOrUpdateDTO, TeachingExercise teachingExercise) {
		teachingExercise.setId(teachingEexrciseCreateOrUpdateDTO.getId());
		teachingExercise.setSubject(teachingEexrciseCreateOrUpdateDTO.getSubject());
		teachingExercise.setRawContent(teachingEexrciseCreateOrUpdateDTO.getRawContent());
		teachingExercise.setTopic(getTopic(teachingEexrciseCreateOrUpdateDTO));
		teachingExercise.setGroup(getGroup(teachingEexrciseCreateOrUpdateDTO));
		teachingExercise.setStudents(getListOfStudent(teachingEexrciseCreateOrUpdateDTO.studentIds));
		teachingExercise.setTeachers(getListOfTeacher(teachingEexrciseCreateOrUpdateDTO.teacherIds));
		teachingExercise.setDisciplines(getListOfDiscipline(teachingEexrciseCreateOrUpdateDTO.disciplineIds));
		return teachingExercise;
	}

	private static List<Teacher> getListOfTeacher(List<Long> teacherIds) {
		if (CollectionUtils.isEmpty(teacherIds)) {
			return Collections.emptyList();
		}
		return teacherIds.stream().map(id -> {
			Teacher teacher = new Teacher();
			teacher.setId(id);
			return teacher;
		}).collect(Collectors.toList());
	}

	private static List<Student> getListOfStudent(List<Long> studentIds) {
		if (CollectionUtils.isEmpty(studentIds)) {
			return Collections.emptyList();
		}
		return studentIds.stream().map(id -> {
			Student student = new Student();
			student.setId(id);
			return student;
		}).collect(Collectors.toList());
	}

	private static List<Discipline> getListOfDiscipline(List<Long> disciplineIds) {
		if (CollectionUtils.isEmpty(disciplineIds)) {
			return Collections.emptyList();
		}
		return disciplineIds.stream().map(id -> {
			Discipline discipline = new Discipline();
			discipline.setId(id);
			return discipline;
		}).collect(Collectors.toList());
	}

	private static Topic getTopic(TeachingEexrciseCreateOrUpdateDTO teachingEexrciseCreateOrUpdateDTO) {
		if (teachingEexrciseCreateOrUpdateDTO.getTopicId() == null) {
			return null;
		}
		Topic topic = new Topic();
		topic.setId(teachingEexrciseCreateOrUpdateDTO.getTopicId());
		return topic;
	}

	private static Group getGroup(TeachingEexrciseCreateOrUpdateDTO teachingEexrciseCreateOrUpdateDTO) {
		if (teachingEexrciseCreateOrUpdateDTO.getGroupId() == null) {
			return null;
		}
		Group group = new Group();
		group.setId(teachingEexrciseCreateOrUpdateDTO.getGroupId());
		return group;
	}



}
