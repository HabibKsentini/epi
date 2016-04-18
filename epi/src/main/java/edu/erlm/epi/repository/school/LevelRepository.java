package edu.erlm.epi.repository.school;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.erlm.epi.domain.school.Level;

public interface LevelRepository extends JpaRepository<Level, Long> {

}
