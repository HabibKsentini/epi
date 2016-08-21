package edu.erlm.epi.web.rest;


import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import edu.erlm.epi.domain.school.Group;
import edu.erlm.epi.repository.school.GroupRepository;
import edu.erlm.epi.security.AuthoritiesConstants;
import edu.erlm.epi.service.GroupService;
import edu.erlm.epi.web.rest.dto.GroupDTO;
import edu.erlm.epi.web.rest.dto.GroupSearchDTO;
import edu.erlm.epi.web.rest.dto.ManagedGroupDTO;
import edu.erlm.epi.web.rest.util.HeaderUtil;
import edu.erlm.epi.web.rest.util.PaginationUtil;

@RestController
@RequestMapping("/api")
public class GroupResources {

	@Autowired
	GroupService groupService;
	
	@Autowired
	GroupRepository groupRepository;
	
	@Secured(AuthoritiesConstants.ADMIN)
	@Timed
	@RequestMapping(path = "/groups", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<GroupDTO>> search(Pageable pageable, GroupSearchDTO groupSearchModel) throws URISyntaxException {
		Page<GroupDTO> page = groupService.search(groupSearchModel, pageable);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/groups");
		return ResponseEntity.ok().headers(headers).body(page.getContent()); 
	}
	
	@Secured(AuthoritiesConstants.ADMIN)
	@Timed
	@RequestMapping(path = "/groups", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> create(@RequestBody ManagedGroupDTO groupDTO) throws URISyntaxException {
		if(groupRepository.findByNameAndLevelAndSchoolYear(groupDTO.getName(), groupDTO.getLevel().getName(), groupDTO.getSchoolYear().getName()).isPresent()){
			return ResponseEntity.badRequest()
					.headers(HeaderUtil.createFailureAlert("class-management", "Class alredy exists", "name, level, school year already in use"))
					.body(null);
		}
		Group group = groupService.createOrUpdate(groupDTO); 
		return ResponseEntity.created(new URI("/groups/" + group.getId())).body(group);
	}

	@Timed
	@RequestMapping(path = "/groups/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ManagedGroupDTO> get(@PathVariable Long id)  {
		ManagedGroupDTO group = groupService.findOne(id);  
		return ResponseEntity.ok().body(group); 
	}
	
	@Secured(AuthoritiesConstants.ADMIN)
	@Timed
	@RequestMapping(path = "/groups/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> delete(@PathVariable Long id)  {
		groupRepository.delete(id);
		return ResponseEntity.ok().build(); 
	}
	

}
