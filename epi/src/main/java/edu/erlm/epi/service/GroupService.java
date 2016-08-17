package edu.erlm.epi.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.erlm.epi.domain.school.Group;
import edu.erlm.epi.domain.school.Student;
import edu.erlm.epi.repository.SearchSpecification;
import edu.erlm.epi.repository.school.GroupRepository;
import edu.erlm.epi.repository.school.StudentRepository;
import edu.erlm.epi.web.rest.dto.GroupDTO;
import edu.erlm.epi.web.rest.dto.GroupSearchDTO;
import edu.erlm.epi.web.rest.dto.ManagedGroupDTO;

@Service
@Transactional
public class GroupService {

	@Autowired
	private GroupRepository groupRepository;
	
	@Autowired
	StudentRepository studentRepository;

	public Page<GroupDTO> search(GroupSearchDTO groupSearchModel, Pageable pageable) {
		SearchSpecification<Group> groupSearchSpec = new SearchSpecification<>();
		Group groupModel = groupSearchModel.convert();
		Specification<Group> spec = groupSearchSpec.find(groupModel);
		Page<Group> groupsPage = groupRepository.findAll(spec, pageable);
		return groupsPage.map(group -> new GroupDTO(group));
	}

	public ManagedGroupDTO findOne(Long id) {
		Group group = groupRepository.findOne(id);
		ManagedGroupDTO dto = new ManagedGroupDTO(group);
		return dto;
	}
	
	public Group createOrUpdate(ManagedGroupDTO groupDTO) {
		Group dbGroup = null; 
		if(groupDTO.getId() != null){
			dbGroup =  groupRepository.getOne(groupDTO.getId());
		}
		Group group = groupDTO.convert(dbGroup);
		List<Student> students = group.getStudents();
		if(students != null){
			List<Student> dbStudents = students.stream()
					.map(student -> studentRepository.getOne(student.getId())).collect(Collectors.toList());
			group.setStudents(dbStudents);
		}
		Group newGroup = groupRepository.save(group);
		return newGroup;
	}

}
