package edu.erlm.epi.repository.school;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.erlm.epi.domain.User;
import edu.erlm.epi.domain.school.Group;

public interface GroupRepository extends JpaRepository<Group, Long>, JpaSpecificationExecutor<Group>{

	@Query("select group from Group group where group.level.id = :levelId and group.schoolYear.active = true")
	List<Group> findByLevelId(@Param("levelId")Long levelId);
	
	
	@Query("select group from Group group where group.id = :id")
	List<Group> findById(@Param("id")Long id);

}
