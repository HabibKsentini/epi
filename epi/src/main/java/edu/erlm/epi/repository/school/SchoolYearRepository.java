package edu.erlm.epi.repository.school;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.erlm.epi.domain.school.SchoolYear;

public interface SchoolYearRepository extends JpaRepository<SchoolYear, Long>{
	
	
	@Modifying(clearAutomatically = true)
	@Query("update SchoolYear schoolYear set schoolYear.active = false where id != :id")
	void makeAllDeactivatedExcept(@Param("id") Long id );

}
