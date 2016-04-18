package edu.erlm.epi.repository;

import java.util.List;

public interface Searchable {

	public Object get(String key);
	public List<String> getAttributes();
}
