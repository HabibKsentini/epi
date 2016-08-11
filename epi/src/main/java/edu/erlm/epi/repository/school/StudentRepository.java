package edu.erlm.epi.repository.school;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.erlm.epi.domain.school.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
	
	

	@Query(value = "select student FROM Student student WHERE"
			+ "(:searchText = '')" 
			+ " OR (LOWER(CONCAT(student.firstName, student.lastName)) LIKE LOWER(CONCAT('%',:searchText,'%')))"
			+ " OR (LOWER(CONCAT(student.lastName, student.firstName)) LIKE LOWER(CONCAT('%',:searchText,'%')))"
			+ " AND student.activated = true ")
	Page<Student> search (@Param("searchText") String searchText, Pageable pageable);
}
