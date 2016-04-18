package edu.erlm.epi.domain.exercise;

import java.io.Serializable;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.validator.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.istack.internal.NotNull;

import edu.erlm.epi.domain.AbstractAuditingEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "t_file")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class File extends AbstractAuditingEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "t_file_id_seq")
	@SequenceGenerator(sequenceName = "t_file_id_seq", name = "t_file_id_seq")
	private Long id;
	
	@NotBlank
	private String name; 
	
	@NotNull
	private Integer length ; 
	
	@Lob
	@Basic(fetch = FetchType.LAZY)
	@NotNull
	@JsonIgnore
	private byte[] binaryData; 
	
	@Column(name="teaching_exercise_id")
	private Long teachingExerciseId; 
	
	

}
