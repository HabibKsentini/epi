package edu.erlm.epi.web.rest.exercise;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.erlm.epi.domain.exercise.File;
import edu.erlm.epi.domain.exercise.TeachingExercise;
import edu.erlm.epi.domain.exercise.support.TeachingExerciseInfoDTO;
import edu.erlm.epi.repository.exercise.FileRepository;
import edu.erlm.epi.repository.exercise.TeachingExerciseRepository;
import edu.erlm.epi.service.UserService;
import edu.erlm.epi.service.exercise.TeachingExerciseService;
import edu.erlm.epi.service.util.FileUtil;
import edu.erlm.epi.web.rest.dto.FileDTO;
import edu.erlm.epi.web.rest.dto.ImageDTO;
import edu.erlm.epi.web.rest.dto.TeachingEexrciseCreateOrUpdateDTO;
import edu.erlm.epi.web.rest.dto.TeachingExerciseDTO;
import edu.erlm.epi.web.rest.util.HeaderUtil;

@RestController
@RequestMapping("/exercises")
public class TeachingExerciseResource {

	@Autowired
	private FileRepository fileRepository;
	
	@Autowired
	private UserService userService;

	@Autowired
	private TeachingExerciseRepository teachingExerciseRepository;
	

	@Autowired
	private TeachingExerciseService teachingExerciseService;

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<TeachingExerciseDTO> get(@PathVariable Long id) {
		return new ResponseEntity<>(teachingExerciseService.getOne(id), HttpStatus.OK);
	}

	@RequestMapping(value = "/markedForRead", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<TeachingExerciseInfoDTO>> getMarkedForRead() {
		List<TeachingExerciseInfoDTO> exercises = teachingExerciseService.getMarkedForReadExercise();
		return new ResponseEntity<>(exercises, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/setAsMarkedForRead", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> setAsMarkedForRead(@RequestParam Long id) {
		userService.setTeachingExerciseAsMarkedForRead(id);
		return new ResponseEntity<>( HttpStatus.OK);
	}

	@RequestMapping(value = "/inPrepartionAndWaitingForValidation", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<TeachingExerciseInfoDTO>> inPreparationAndWaitingForValidation() {
		List<TeachingExerciseInfoDTO> teachingExerciseInfoDTOs = teachingExerciseService.getListExercise();
		return new ResponseEntity<>(teachingExerciseInfoDTOs, HttpStatus.OK);
	}

	@RequestMapping(value = "/validate", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> validate(@RequestParam Long id) {
		teachingExerciseService.validate(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/goToWaitingForValidation", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> goToWaitingForValidation(@RequestParam Long id) {
		teachingExerciseService.goToWaitingForValidation(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/uploadImage", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ImageDTO> uploadImage(@RequestParam("file") MultipartFile multipartFile) throws IOException {


		ImageDTO imageDTO = FileUtil.uploadImage(multipartFile);
		return new ResponseEntity<>(imageDTO, HttpStatus.OK);
	}

	@RequestMapping(value = "/uploadFile", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile multipartFile,
			@RequestParam("teachingExerciseId") Long teachingExerciseId) throws IOException, URISyntaxException {
		File file = FileUtil.valueOfFile(multipartFile, teachingExerciseId);
		file = fileRepository.save(file);
		FileDTO fileDTO = FileDTO.valueOf(file);
		return ResponseEntity.created(new URI("/files/" + file.getId()))
				.headers(HeaderUtil.createAlert("file.created", file.getId().toString())).body(fileDTO);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		teachingExerciseService.delete(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/search", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Page<TeachingExerciseInfoDTO>> search(@RequestParam(name = "topicId", required= false) Long topicId, @RequestParam(name = "groupId", required= false) Long groupId,
			@RequestParam(name = "subject", required= false) String subject, Pageable pageable) {
		TeachingExercise te = new TeachingExercise(subject, topicId, groupId, TeachingExercise.Status.VALIDATED);
		Page<TeachingExerciseInfoDTO> page = teachingExerciseService.search(te, pageable);
		return new ResponseEntity<>(page, HttpStatus.OK);
	}

	@RequestMapping(value = "/createNew", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> createNew() throws URISyntaxException {
		TeachingExercise teachingExercise = new TeachingExercise();
		teachingExerciseRepository.save(teachingExercise);
		TeachingExerciseDTO teachingExerciseDTO = new TeachingExerciseDTO(teachingExercise);
		return ResponseEntity.created(new URI("/exercises/" + teachingExercise.getId()))
				.headers(HeaderUtil.createAlert("exercise.created", teachingExercise.getId().toString()))
				.body(teachingExerciseDTO);
	}

	@RequestMapping(value = "", method = RequestMethod.PUT)
	public ResponseEntity<?> update(@RequestBody TeachingEexrciseCreateOrUpdateDTO teachingEexrciseCreateOrUpdateDTO)
			throws URISyntaxException {
		TeachingExercise exercise = teachingExerciseRepository.findOne(teachingEexrciseCreateOrUpdateDTO.getId());
		exercise = TeachingEexrciseCreateOrUpdateDTO.convertToTeachingExercise(teachingEexrciseCreateOrUpdateDTO,
				exercise);
		teachingExerciseRepository.save(exercise);
		exercise.setMedias(teachingExerciseService.updateMediaLinks(teachingEexrciseCreateOrUpdateDTO.getId(), teachingEexrciseCreateOrUpdateDTO.getMediaUrls()));
		TeachingExerciseDTO teachingExerciseDTO = new TeachingExerciseDTO(exercise);
		return ResponseEntity.created(new URI("/exercise/details/" + exercise.getId()))
				.headers(HeaderUtil.createAlert("exercise.updated", exercise.getId().toString())).body(teachingExerciseDTO);
	}

	@RequestMapping(value = "/files", method = RequestMethod.GET)
	ResponseEntity<List<File>> getFiles(@RequestParam Long teachingExerciseId) {

		List<File> files = fileRepository.findByTeachingExerciseId(teachingExerciseId);
		return new ResponseEntity<>(files, HttpStatus.OK);
	}
}
