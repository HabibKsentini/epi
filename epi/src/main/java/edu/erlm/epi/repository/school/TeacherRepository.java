package edu.erlm.epi.repository.school;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.erlm.epi.domain.school.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

}
