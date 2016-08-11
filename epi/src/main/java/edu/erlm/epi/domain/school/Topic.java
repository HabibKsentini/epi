package edu.erlm.epi.domain.school;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.NotBlank;

import groovy.transform.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@EqualsAndHashCode(includes = { "name" })
@Table(name = "t_topic_param")
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class Topic implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "t_topic_param_id_seq")
	@SequenceGenerator(sequenceName = "t_topic_param_id_seq", name = "t_topic_param_id_seq")
	private Long id;

	@NotBlank
	@Size(min = 1, max = 255)
	private String name;
	
	@Column(name = "topic_color")
	private String topicColor;


	@Override
	public String toString() {
		return "Topic [name=" + name + "]";
	}
	
	

}
