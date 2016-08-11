package edu.erlm.epi.web.rest.dto;

import edu.erlm.epi.domain.school.Group;
import edu.erlm.epi.domain.school.Level;
import edu.erlm.epi.domain.school.SchoolYear;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupSearchDTO {

	private Long id;
	private String name;
	private Long levelId;
	private Long schoolYearId;

	public Group convert() {
		Group group = new Group();
		group.setId(this.id);
		group.setName(this.name);
		convertLevel(group);
		convertGroup(group);
		return group;
	}

	private void convertGroup(Group group) {
		if (schoolYearId != null) {
			SchoolYear schoolYear = new SchoolYear();
			schoolYear.setId(schoolYearId);
			group.setSchoolYear(schoolYear);
		}
	}

	private void convertLevel(Group group) {
		if (levelId != null) {
			Level level = new Level();
			level.setId(this.levelId);
			group.setLevel(level);
		}
	}

}
