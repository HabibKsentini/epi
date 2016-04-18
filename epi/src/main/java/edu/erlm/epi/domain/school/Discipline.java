package edu.erlm.epi.domain.school;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Entity
@Table(name = "t_discipline_param")
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
@ToString
public class Discipline implements Serializable{

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator="t_discipline_param_id_seq")
	@SequenceGenerator(sequenceName="t_discipline_param_id_seq", name ="t_discipline_param_id_seq")
	private Long id;

	@NotNull
	@Size(min = 1, max = 255)
	private String name;

}
