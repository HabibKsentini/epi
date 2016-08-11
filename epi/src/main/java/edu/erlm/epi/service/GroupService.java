package edu.erlm.epi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.erlm.epi.domain.school.Group;
import edu.erlm.epi.repository.SearchSpecification;
import edu.erlm.epi.repository.school.GroupRepository;
import edu.erlm.epi.web.rest.dto.GroupDTO;
import edu.erlm.epi.web.rest.dto.GroupSearchDTO;


@Service
@Transactional
public class GroupService {
	
	@Autowired
	private GroupRepository groupRepository;
	
	public Page<GroupDTO> search(GroupSearchDTO groupSearchModel, Pageable pageable){
    	SearchSpecification<Group> groupSearchSpec = new SearchSpecification<>();
		Group groupModel = groupSearchModel.convert();
		Specification<Group> spec = groupSearchSpec.find(groupModel);
		Page<Group> groupsPage = groupRepository.findAll(spec, pageable); 
		return groupsPage.map(group -> new GroupDTO(group));
    }

}
