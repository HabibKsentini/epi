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

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "t_school_year")
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class SchoolYear implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "t_school_year_id_seq")
	@SequenceGenerator(sequenceName = "t_school_year_id_seq", name = "t_school_year_id_seq")
	private Long id;

	@NotNull
	@Size(min = 9, max = 9)
	private String name;
	
	@NotNull
	private Boolean active;

	@Override
	public boolean equals(Object o) {
		if (!(o instanceof SchoolYear)) {
			return false;
		}
		SchoolYear otherSchoolYear = (SchoolYear) o;
		EqualsBuilder builder = new EqualsBuilder();
		builder.append(getName(), otherSchoolYear.getName());
		return builder.isEquals();
	}

	@Override
	public int hashCode() {
		HashCodeBuilder builder = new HashCodeBuilder();
		builder.append(getName());
		return builder.hashCode();
	}
}
