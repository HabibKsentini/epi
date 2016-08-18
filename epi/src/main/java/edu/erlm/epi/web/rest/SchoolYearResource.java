package edu.erlm.epi.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.erlm.epi.domain.school.SchoolYear;
import edu.erlm.epi.repository.school.SchoolYearRepository;
import edu.erlm.epi.service.SchoolYearService;

@RestController
@RequestMapping("/api")
public class SchoolYearResource {

	@Autowired
	private SchoolYearService service;

	@RequestMapping(value = "/schoolYears", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> update(@RequestBody SchoolYear schoolYear) {
		SchoolYear dbSchoolYear = service.save(schoolYear);
		return ResponseEntity.ok(dbSchoolYear);
	}
	
}
