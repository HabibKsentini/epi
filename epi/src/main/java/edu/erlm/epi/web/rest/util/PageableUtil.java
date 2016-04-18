package edu.erlm.epi.web.rest.util;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.PagedResources;

public class PageableUtil {

	private PageableUtil() {
	}

	 public static PagedResources.PageMetadata pageMetadataFromPage(Page page) {
	        return new PagedResources.PageMetadata(page.getSize(), page.getNumber(), page.getTotalElements(), page.getTotalPages());
	    }

}
