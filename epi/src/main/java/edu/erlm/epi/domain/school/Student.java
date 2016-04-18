package edu.erlm.epi.domain.school;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import edu.erlm.epi.domain.User;
import lombok.ToString;

@Entity
@ToString
@DiscriminatorValue(value = "Student")
public class Student extends User{

	private static final long serialVersionUID = 1L;

}
