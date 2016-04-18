package edu.erlm.epi.repository.school;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.erlm.epi.domain.school.Discipline;

public interface DisciplineRepository extends JpaRepository<Discipline, Long> {

}
