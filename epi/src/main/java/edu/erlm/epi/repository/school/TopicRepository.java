package edu.erlm.epi.repository.school;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.erlm.epi.domain.school.Teacher;
import edu.erlm.epi.domain.school.Topic;

public interface TopicRepository extends JpaRepository<Topic, Long>{

	List<Teacher> findValidtorsById(Long id); 
}
