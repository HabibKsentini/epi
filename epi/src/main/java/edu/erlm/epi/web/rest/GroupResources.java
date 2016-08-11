package edu.erlm.epi.web.rest;


import java.net.URISyntaxException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.erlm.epi.service.GroupService;
import edu.erlm.epi.web.rest.dto.GroupDTO;
import edu.erlm.epi.web.rest.dto.GroupSearchDTO;
import edu.erlm.epi.web.rest.util.PaginationUtil;

@RestController
@RequestMapping("/api")
public class GroupResources {

	@Autowired
	GroupService groupService;
	
	@RequestMapping(path = "/groups", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<GroupDTO>> search(Pageable pageable, GroupSearchDTO groupSearchModel) throws URISyntaxException {
		Page<GroupDTO> page = groupService.search(groupSearchModel, pageable);
		HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/groups");
		return ResponseEntity.ok().headers(headers).body(page.getContent()); 
	}

}
