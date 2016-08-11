package edu.erlm.epi.config;

import org.springframework.context.annotation.Configuration;

import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;

import edu.erlm.epi.domain.exercise.File;
import edu.erlm.epi.domain.exercise.TeachingExercise;
import edu.erlm.epi.domain.school.Discipline;
import edu.erlm.epi.domain.school.Group;
import edu.erlm.epi.domain.school.Level;
import edu.erlm.epi.domain.school.SchoolYear;
import edu.erlm.epi.domain.school.Student;
import edu.erlm.epi.domain.school.Teacher;
import edu.erlm.epi.domain.school.Topic;

@Configuration
public class ApiWebMvcConfiguration extends RepositoryRestMvcConfiguration {

	@Override
	protected void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		Class<?>[] domainTypesToExposeIds = { Topic.class, Discipline.class, Level.class, Group.class, Student.class,
				Teacher.class, File.class , TeachingExercise.class, SchoolYear.class};
		config.exposeIdsFor(domainTypesToExposeIds);
		config.setReturnBodyOnUpdate(true);
		config.setReturnBodyOnCreate(true);
	}

}
