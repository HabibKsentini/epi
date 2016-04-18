package edu.erlm.epi.domain.school;

import java.util.List;

import org.springframework.data.rest.core.config.Projection;

@Projection(types = Group.class, name = "withStudents")
public interface GroupWithStudentsProjection {

	Long getId();

    String getName();

    List<Student> getStudents(); 
}
