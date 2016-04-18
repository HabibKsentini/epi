package edu.erlm.epi.domain.exercise;

import java.time.ZonedDateTime;

import org.springframework.data.rest.core.config.Projection;

@Projection(types = File.class, name = "withCreationDate")
public interface FileWithCreationDateProjection {

	Long getId();

	String getName();

	ZonedDateTime getCreatedDate();
}
