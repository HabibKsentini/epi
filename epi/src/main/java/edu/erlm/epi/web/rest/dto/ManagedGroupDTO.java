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

	private Long id;
	private Level level;
	private SchoolYear schoolYear;
	private String name;
	private List<Student> students;
	private String completeName;

	/**
	 * 
	 */
	public ManagedGroupDTO() {
	}

	public ManagedGroupDTO(Group group) {
		this.id = group.getId();
		this.name = group.getName();
		this.completeName = group.getCompleteName();
		getStudents(group);
		getLevel(group);
		getSchoolYear(group);
	}

	private void getLevel(Group group) {
		if (group.getLevel() != null) {
			this.level = group.getLevel();
			this.level.getId();
		}
	}

	private void getSchoolYear(Group group) {
		if (group.getSchoolYear() != null) {
			this.schoolYear = group.getSchoolYear();
			this.schoolYear.getId();
		}
	}

	private void getStudents(Group group) {
		if (group.getStudents() != null) {
			this.students = group.getStudents();
			this.students.size();
		}
	}

	public Group convert(Group group) {
		if (group == null) {
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
