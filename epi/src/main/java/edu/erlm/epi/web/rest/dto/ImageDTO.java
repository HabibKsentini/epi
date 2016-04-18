package edu.erlm.epi.web.rest.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImageDTO {

	public ImageDTO (String absolutePath){
		this.absolutePath = absolutePath; 
	}
	String absolutePath; 
	
}
