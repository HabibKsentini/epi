package edu.erlm.epi.domain.school;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import edu.erlm.epi.domain.Authority;
import edu.erlm.epi.domain.User;
import edu.erlm.epi.security.SecurityUtils;
import lombok.ToString;

@Entity
@ToString
@DiscriminatorValue(value = "Student")
public class Student extends User{

	private static final long serialVersionUID = 1L;
	
	public Student() {
		Authority studentAuthority = new Authority(); 
		studentAuthority.setName(SecurityUtils.STUDENT_ROLE);
		Set<Authority> authorities = new HashSet<>(1); 
		authorities.add(studentAuthority); 
		this.setAuthorities(authorities);
	}

}
