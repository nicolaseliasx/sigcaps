package sigcaps.api.controller;

import java.util.Optional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sigcaps.repository.model.Config;
import sigcaps.service.AuthService;
import sigcaps.service.ConfigService;
import sigcaps.service.model.ConfigDto;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

	@Autowired
	private ConfigService configService;

	@Autowired
	private AuthService authService;

	@Autowired
	private ModelMapper modelMapper;

	@GetMapping
	public ResponseEntity<ConfigDto> loadConfig() {
		try {
			Optional<ConfigDto> optionalConfig = configService.load();
			if (optionalConfig.isEmpty()) {
				throw new RuntimeException("Config not found.");
			}
			ConfigDto configDto = optionalConfig.get();
			return ResponseEntity.ok(configDto);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PutMapping
	public ResponseEntity<ConfigDto> saveConfig(@RequestBody ConfigDto config) {
		try {
			this.configService.save(config);
			return ResponseEntity.ok(config);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}
