package edu.erlm.epi.web.rest.dto;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import edu.erlm.epi.domain.User;
import edu.erlm.epi.domain.exercise.MediaLink;
import edu.erlm.epi.domain.exercise.TeachingExercise;
import edu.erlm.epi.domain.exercise.TeachingExercise.Status;
import edu.erlm.epi.domain.school.Discipline;
import edu.erlm.epi.domain.school.Group;
import edu.erlm.epi.domain.school.Level;
import edu.erlm.epi.domain.school.Student;
import edu.erlm.epi.domain.school.Teacher;
import edu.erlm.epi.domain.school.Topic;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeachingExerciseDTO {
	private Status status;

	private Long id;

	private String subject;

	private String rawContent;

	private Topic topic;

	private Group group;

	private Level level;
	
	private List<Discipline> disciplines; 

	private List<Student> students;

	private List<Teacher> teachers;	
	
	private List<String> mediaUrls;
	
	private ZonedDateTime createdDate;
	
	
	private boolean isMarkedForRead = false; 

	public TeachingExerciseDTO(TeachingExercise teachingExercise) {
		super();
		this.status = teachingExercise.getStatus();
		this.id = teachingExercise.getId();
		this.subject = teachingExercise.getSubject();
		this.rawContent = teachingExercise.getRawContent();
		this.topic = teachingExercise.getTopic();
		this.level = teachingExercise.getGroup() != null ? teachingExercise.getGroup().getLevel() : null;
		this.group = teachingExercise.getGroup();
		this.students = teachingExercise.getStudents();
		this.teachers = teachingExercise.getTeachers();
		this.disciplines = teachingExercise.getDisciplines(); 
		this.createdDate = teachingExercise.getCreatedDate(); 
		this.isMarkedForRead = teachingExercise.isMarkedForReadByTheCurrentUser(); 
		List<MediaLink> medias = teachingExercise.getMedias();
		this.mediaUrls = new ArrayList<String>();
		if (medias != null && !medias.isEmpty()){
			for (MediaLink ml : medias){
				this.mediaUrls.add(ml.getMediaURL());
			}
		}
	}
	
	
	
	

}
