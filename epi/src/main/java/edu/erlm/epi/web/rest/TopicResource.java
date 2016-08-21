package edu.erlm.epi.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import edu.erlm.epi.repository.school.TopicRepository;
import edu.erlm.epi.security.AuthoritiesConstants;
import edu.erlm.epi.web.rest.util.HeaderUtil;

@RestController
@RequestMapping("/api")
public class TopicResource {
	
	
	@Autowired
	TopicRepository topicRepository; 

	
	@Secured(AuthoritiesConstants.ADMIN)
	@Timed
	@RequestMapping(path = "/topics/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> delete(@PathVariable Long id)  {
		try{
			topicRepository.delete(id);
		}catch(Exception exception){
			return ResponseEntity.badRequest()
					.headers(HeaderUtil.createFailureAlert("topic-management", "can not be deleted", "can not be deleted"))
					.body(null);
		}
		return ResponseEntity.ok().build(); 
	}
	

}
