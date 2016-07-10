package edu.erlm.epi.service.util;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.web.multipart.MultipartFile;

import edu.erlm.epi.web.rest.dto.ImageDTO;

public class FileUtil {

	private FileUtil() {
	}

	public final static String IMAGE_DIRECTORY_ABSOLUTE_PATH = "D:/DevTools/Workspace/epi/epi/src/main/webapp/dist/uploads";
	public final static String IMAGE_DIRECTORY_RELATIVE_PATH = "dist/uploads";

	public static ImageDTO uploadImage(MultipartFile multipartFile) throws IOException {
		if (multipartFile.isEmpty()) {
			throw new RuntimeException("error occured during image upload: the Image is Empty");
		}
		String fileName = generateUniqueFileName();
		File file = new File(IMAGE_DIRECTORY_ABSOLUTE_PATH + File.separator + fileName
				+ FilenameUtils.EXTENSION_SEPARATOR + FilenameUtils.getExtension(multipartFile.getOriginalFilename()));
		FileUtils.writeByteArrayToFile(file, multipartFile.getBytes());
		return new ImageDTO(IMAGE_DIRECTORY_RELATIVE_PATH + File.separator + file.getName());
	}

	public static edu.erlm.epi.domain.exercise.File valueOfFile(MultipartFile multipartFile, Long techingExerciseId)
			throws IOException {
		if (multipartFile.isEmpty()) {
			throw new RuntimeException("error occured during file upload: the multipartFile is Empty");
		}
		edu.erlm.epi.domain.exercise.File file = new edu.erlm.epi.domain.exercise.File();
		file.setBinaryData(multipartFile.getBytes());
		file.setName(multipartFile.getOriginalFilename());
		file.setLength((int) multipartFile.getSize());
		file.setTeachingExerciseId(techingExerciseId);
		return file;
	}

	public static String generateUniqueFileName() {
		String filename = "";
		long millis = System.currentTimeMillis();
		@SuppressWarnings("deprecation")
		String datetime = new Date().toGMTString();
		datetime = datetime.replace(" ", "");
		datetime = datetime.replace(":", "");
		String rndchars = RandomStringUtils.randomAlphanumeric(16);
		filename = rndchars + datetime + millis;
		return filename;
	}

}
