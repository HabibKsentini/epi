package edu.erlm.epi.web.rest.dto;

import java.util.List;

import edu.erlm.epi.domain.school.Group;
import edu.erlm.epi.domain.school.Level;
import edu.erlm.epi.domain.school.SchoolYear;
import edu.erlm.epi.domain.school.Student;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupDTO {
	
	private Long id; 
	private String name; 
	private String completeName; 
	private Level level; 
	private SchoolYear schoolYear; 
	private List<Student> students; 
	
	
	public GroupDTO(Group group) {
		this.id = group.getId(); 
		this.name = group.getName(); 
		this.completeName = group.getCompleteName();
		this.level = group.getLevel(); 
		this.schoolYear = group.getSchoolYear(); 
	}
	
	public Group convert() {
		Group group = new Group(); 
		group.setId(this.id);
		group.setName(this.getName());
		group.setLevel(this.getLevel());
		group.setSchoolYear(this.getSchoolYear());
		group.setStudents(this.getStudents());
		return group; 
	}

}
