package edu.erlm.epi.repository.school;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.erlm.epi.domain.school.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
	
}
