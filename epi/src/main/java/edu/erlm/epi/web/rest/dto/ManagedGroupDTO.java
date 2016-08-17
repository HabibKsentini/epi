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
public class ManagedGroupDTO {

	private Long id ;
	private Level level;
	private SchoolYear schoolYear;
	private String name;
	private List<Student> students;
	private String completeName; 

	/**
	 * 
	 */
	public ManagedGroupDTO(){
	}

	public ManagedGroupDTO(Group group){
		this.id = group.getId(); 
		this.level = group.getLevel();
		this.level.getId(); 
		this.schoolYear = group.getSchoolYear(); 
		this.schoolYear.getId(); 
		this.name = group.getName(); 
		this.students = group.getStudents(); 
		this.students.size(); 
		this.completeName = group.getCompleteName(); 
	}
	
	public Group convert(Group group) {
		if(group == null){
			group = new Group(); 
		}
		group.setId(id);
		group.setLevel(level);
		group.setSchoolYear(schoolYear);
		group.setName(name);
		group.setStudents(students);
		return group;
	}

}
