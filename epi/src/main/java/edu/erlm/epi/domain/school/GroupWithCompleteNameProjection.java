package edu.erlm.epi.domain.school;

import org.springframework.data.rest.core.config.Projection;

@Projection(types = Group.class, name = "withCompleteName")
public interface GroupWithCompleteNameProjection {
	
	Long getId();

    String getName();

    String getCompleteName(); 
}
