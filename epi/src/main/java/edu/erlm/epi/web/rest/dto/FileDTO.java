package edu.erlm.epi.web.rest.dto;

import java.time.ZonedDateTime;

import edu.erlm.epi.domain.exercise.File;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileDTO {

	private Long id;

	private String name;

	private ZonedDateTime createdDate;

	public static FileDTO valueOf(File file) {
		FileDTO fileDTO = new FileDTO();
		if (file == null) {
			return fileDTO;
		}
		fileDTO.setId(file.getId());
		fileDTO.setCreatedDate(file.getCreatedDate());
		fileDTO.setName(file.getName());
		return fileDTO;
	}

}
