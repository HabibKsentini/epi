package edu.erlm.epi.domain.exercise;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
 
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.hibernate.annotations.Type;

import edu.erlm.epi.domain.AbstractAuditingEntity;
import edu.erlm.epi.domain.User;
import edu.erlm.epi.domain.school.Discipline;
import edu.erlm.epi.domain.school.Group;
import edu.erlm.epi.domain.school.Student;
import edu.erlm.epi.domain.school.Teacher;
import edu.erlm.epi.domain.school.Topic;
import edu.erlm.epi.repository.Searchable;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Entity
@ToString
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(name = "t_teaching_exercise")
public class TeachingExercise extends AbstractAuditingEntity implements Serializable, Searchable {

	private static final long serialVersionUID = 1L;

	public TeachingExercise(String subject, Long topicId, Long groupId, TeachingExercise.Status status) {
		if(groupId != null){
			Group group = new Group();
			group.setId(groupId);
			this.group = group;
		}
		if(topicId != null){
			Topic topic = new Topic();
			topic.setId(topicId);
			this.topic = topic;
		}
		this.subject = subject;
		this.status = status; 
	}

	public TeachingExercise() {
		this.status = Status.IN_PREPARATION;
	}

	public enum Status {
		VALIDATED, WAITING_FOR_VALIDATION, IN_PREPARATION
	};

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "t_teaching_exercise_id_seq")
	@SequenceGenerator(sequenceName = "t_teaching_exercise_id_seq", name = "t_teaching_exercise_id_seq")
	private Long id;

	@Enumerated(EnumType.STRING)
	@NotNull
	private Status status;

	@Type(type = "text")
	private String subject;

	@Type(type = "text")
	private String rawContent;

	@JoinColumn(name = "topic_id")
	@ManyToOne
	private Topic topic;

	@ManyToMany
	@JoinTable(name = "t_marked_to_read_teaching_exercise_user_junc", joinColumns = {
			@JoinColumn(referencedColumnName = "id", name = "teaching_exercise_id") }, inverseJoinColumns = {
					@JoinColumn(referencedColumnName = "id", name = "user_id") })
	private List<User> followers;
	
	@OneToMany(cascade = CascadeType.REMOVE)
	@JoinColumn(referencedColumnName = "id", name = "teaching_exercise_id")
	private List<MediaLink> medias =new ArrayList<MediaLink>();

	@ManyToMany
	@JoinTable(name = "t_teaching_exercise_discipline_param_junc", joinColumns = {
			@JoinColumn(referencedColumnName = "id", name = "teaching_exercise_id") }, inverseJoinColumns = {
					@JoinColumn(referencedColumnName = "id", name = "discipline_id") })
	private List<Discipline> disciplines;

	@ManyToMany
	@JoinTable(name = "t_teaching_exercise_teacher_junc", joinColumns = {
			@JoinColumn(referencedColumnName = "id", name = "teaching_exercise_id") }, inverseJoinColumns = {
					@JoinColumn(referencedColumnName = "id", name = "user_id") })
	private List<Teacher> teachers;

	@ManyToMany
	@JoinTable(name = "t_teaching_exercise_student_junc", joinColumns = {
			@JoinColumn(referencedColumnName = "id", name = "teaching_exercise_id") }, inverseJoinColumns = {
					@JoinColumn(referencedColumnName = "id", name = "user_id") })
	private List<Student> students;

	@JoinColumn(name = "class_id")
	@ManyToOne
	private Group group;


	@Column(name = "validate_at")
	private LocalDateTime validatedAt;

	@Transient
	private boolean isMarkedForReadByTheCurrentUser = false;

	@Override
	public boolean equals(Object o) {
		if (!(o instanceof TeachingExercise)) {
			return false;
		}
		TeachingExercise otherTeachingExercise = (TeachingExercise) o;
		EqualsBuilder builder = new EqualsBuilder();
		builder.append(getSubject(), otherTeachingExercise.getSubject());
		builder.append(getTopic(), otherTeachingExercise.getTopic());
		builder.append(getCreatedDate(), otherTeachingExercise.getCreatedDate());
		builder.append(getCreatedBy(), otherTeachingExercise.getCreatedBy());
		return builder.isEquals();
	}

	@Override
	public int hashCode() {
		HashCodeBuilder builder = new HashCodeBuilder();
		builder.append(getSubject());
		builder.append(getTopic());
		builder.append(getCreatedDate());
		builder.append(getCreatedBy());
		return builder.hashCode();
	}

	@Override
	@Transient
	public Object get(String attributeName) {
		switch (attributeName) {
		case "topic":
			return topic;
		case "subject":
			return subject;
		case "group":
			return group;
		case "status":
			return status;
		case "medias":
			return medias;
		}
		return null;
	}

	@Override
	public List<String> getAttributes() {
		String[] attributes = { "topic", "subject", "group", "status", "medias" };
		return Arrays.asList(attributes);
	}

}