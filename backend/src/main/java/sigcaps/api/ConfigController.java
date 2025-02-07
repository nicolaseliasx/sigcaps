package sigcaps.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.jsonwebtoken.JwtException;
import sigcaps.model.dto.ConfigDto;
import sigcaps.service.ApplicationService;
import sigcaps.service.TokenService;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

	@Autowired
	private ApplicationService applicationService;

	@Autowired
	private TokenService tokenService;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@GetMapping
	public ResponseEntity<ConfigDto> loadConfig() {
		ConfigDto aux = applicationService.loadConfig();
		return ResponseEntity.ok(aux);
	}

	@PutMapping
	public ResponseEntity<ConfigDto> saveConfig(@RequestHeader("Authorization") String authorizationHeader, @RequestBody ConfigDto config) {
		String token = authorizationHeader.replace("Bearer ", "");
		try {
			tokenService.validateToken(token);

			this.applicationService.saveConfig(config);
			messagingTemplate.convertAndSend("/topic/config/load", config);
			return ResponseEntity.ok(config);
		} catch (JwtException e) {
			return ResponseEntity
					.status(HttpStatus.UNAUTHORIZED)
					.body(null);
		}
	}
}
