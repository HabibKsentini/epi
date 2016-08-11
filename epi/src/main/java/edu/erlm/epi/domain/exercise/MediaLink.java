package edu.erlm.epi.domain.exercise;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.validator.constraints.NotBlank;

import edu.erlm.epi.domain.AbstractAuditingEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "t_media_link")
public class MediaLink extends AbstractAuditingEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "t_media_link_id_seq")
	@SequenceGenerator(sequenceName = "t_media_link_id_seq", name = "t_media_link_id_seq")
	private Long id;
	
	@NotBlank
	@Column(name = "media_url")
	private String mediaURL; 
	
	@Column(name = "media_description")
	private String mediaDescription; 

	
	@Column(name="teaching_exercise_id")
	private Long teachingExerciseId; 
	
	

}
