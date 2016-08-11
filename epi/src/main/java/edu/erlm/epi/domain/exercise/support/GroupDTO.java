package edu.erlm.epi.domain.exercise.support;


import edu.erlm.epi.domain.school.Group;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupDTO {

	private Long id;
	private String name;
	private String nameWithLevel;
	private String completeName;
	private String schoolYear;
	
	public static GroupDTO valueOf(Group group) {
		if (group == null){
			return null;
		}
		GroupDTO groupDTO = new GroupDTO();
		groupDTO.setId(group.getId());
		groupDTO.setName(group.getName());
		groupDTO.setNameWithLevel( group.getLevel().getName() + " " + group.getName() + " " );
		groupDTO.setCompleteName(group.getCompleteName());
		groupDTO.setSchoolYear(group.getSchoolYear().getName());
		return groupDTO;
	}
}
