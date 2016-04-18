package edu.erlm.epi.domain.school;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import edu.erlm.epi.domain.AbstractAuditingEntity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Entity
@Table(name = "t_class")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@ToString
public class Group extends AbstractAuditingEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "t_class_id_seq")
	@SequenceGenerator(sequenceName = "t_class_id_seq", name = "t_class_id_seq")
	private Long id;

	@NotNull
	@Size(min = 1, max = 50)
	@Column(length = 50)
	private String name;

	@JoinColumn(name = "level_id")
	@ManyToOne
	private Level level;

	@JoinColumn(name = "school_year_id")
	@ManyToOne(fetch = FetchType.LAZY)
	private SchoolYear schoolYear;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "t_class_student_junc", joinColumns = {
			@JoinColumn(name = "class_id", referencedColumnName = "id") }, inverseJoinColumns = {
					@JoinColumn(name = "student_id", referencedColumnName = "id") })
	@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	private List<Student> students;

	@Getter(AccessLevel.NONE)
	@Setter(AccessLevel.NONE)
	@Transient
	private String completeName;

	@Override
	public boolean equals(Object o) {
		if (!(o instanceof Group)) {
			return false;
		}
		Group otherGroup = (Group) o;
		EqualsBuilder builder = new EqualsBuilder();
		builder.append(getName(), otherGroup.getName());
		builder.append(getSchoolYear(), otherGroup.getSchoolYear());
		return builder.isEquals();
	}

	@Override
	public int hashCode() {
		HashCodeBuilder builder = new HashCodeBuilder();
		builder.append(getName());
		builder.append(getSchoolYear());
		return builder.hashCode();
	}

	public String getCompleteName() {
		this.completeName = ""; 
		if (this.level != null && this.schoolYear != null) {
			this.completeName = this.level.getName() + " " + this.name + " " + this.schoolYear.getName();
		}
		return this.completeName;
	}

}
