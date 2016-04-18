package edu.erlm.epi.web.rest.util;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;

import edu.erlm.epi.domain.exercise.File;
import edu.erlm.epi.exception.TechnicalException;
import groovy.util.logging.Log4j;

@Log4j
public class DownloadFileUtil {

	private DownloadFileUtil() {
	};

	public static void download(File file, final HttpServletRequest request, final HttpServletResponse response) {
		try (InputStream fileInputStream = new ByteArrayInputStream(file.getBinaryData());
				OutputStream output = response.getOutputStream();) {
			response.reset();
			response.setContentType("application/octet-stream");
			response.setContentLength(file.getLength());
			response.setHeader("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"");
			IOUtils.copyLarge(fileInputStream, output);
			output.flush();
		} catch (IOException e) {
			throw new TechnicalException("error occured during the download of the file: " + file.getName(), e);
		}
	}

}
