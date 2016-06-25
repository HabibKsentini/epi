package edu.erlm.epi.repository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.CollectionUtils;

public class SearchSpecification<T extends Searchable> {
	
	public Specification<T> find(T searchable) {
		return new Specification<T>() {
			@SuppressWarnings("unchecked")
			@Override
			public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<>();
				for (String attributeName : searchable.getAttributes()) {
					Object attributeValue = searchable.get(attributeName);
					if (attributeValue != null) {
						if (attributeValue instanceof String) {
							Expression<String> literal = cb
									.literal(("%" + (String) attributeValue + "%").toUpperCase());
							predicates.add(cb.like(cb.upper(root.get(attributeName)), literal));

						}else if (attributeValue instanceof List<?> || attributeValue instanceof Set<?>){
							Collection<?> values = (Collection<?>) attributeValue; 
							@SuppressWarnings("rawtypes")
							Path<? extends Collection> path = root.get(attributeName); 
							if(!CollectionUtils.isEmpty(values)){
								values.stream().forEach(value -> {
									predicates.add(cb.isMember(value, path)); 
								});
							}
						}
						else
							predicates.add(cb.equal(root.get(attributeName), attributeValue));
					}
				}
				Predicate[] tab = new Predicate[predicates.size()];
				for (int i = 0; i < tab.length; i++) {
					tab[i] = predicates.get(i);
				}

				return cb.and(tab);
			}

		};

	}

}
