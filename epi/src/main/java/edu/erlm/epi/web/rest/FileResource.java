package edu.erlm.epi.web.rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.erlm.epi.domain.exercise.File;
import edu.erlm.epi.repository.exercise.FileRepository;
import edu.erlm.epi.web.rest.util.DownloadFileUtil;

@RequestMapping("/files")
@RestController
public class FileResource {

	@Autowired
	FileRepository fileRepository; 
	
	@RequestMapping(value = "/{fileId}/download" , method = RequestMethod.GET)
	public void download (@PathVariable Long fileId, final HttpServletRequest request, final HttpServletResponse response){
		File file = fileRepository.findOne(fileId); 
		DownloadFileUtil.download(file, request, response);
	}
	
}
