package edu.erlm.epi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.erlm.epi.domain.school.SchoolYear;
import edu.erlm.epi.repository.school.SchoolYearRepository;

@Service
@Transactional
public class SchoolYearService {

	@Autowired
	SchoolYearRepository repository; 
	
	public SchoolYear save(SchoolYear schoolYear) {
		SchoolYear dbSchoolYear = repository.save(schoolYear); 
		if(dbSchoolYear.getActive() == Boolean.TRUE){
			repository.makeAllDeactivatedExcept(dbSchoolYear.getId());
		}
		return dbSchoolYear;
	}
	
}
