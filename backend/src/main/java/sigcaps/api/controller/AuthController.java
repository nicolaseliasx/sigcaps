package sigcaps.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sigcaps.service.AuthService;
import sigcaps.service.model.AuthResponseDto;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@PostMapping("/authenticate")
	public ResponseEntity<?> authenticate(@RequestParam String secretKey) {
		AuthResponseDto response = authService.authenticate(secretKey);
		if (response != null) {
			return ResponseEntity.ok(response);
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chave secreta inválida.");
	}

	@PostMapping("/refresh")
	public ResponseEntity<?> refresh(@RequestParam String refreshToken) {
		AuthResponseDto response = authService.refresh(refreshToken);
		if (response != null) {
			return ResponseEntity.ok(response);
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("RefreshToken inválido ou expirado.");
	}

	@GetMapping("/bootstrap")
	public ResponseEntity<?> bootstrap(@RequestParam String bootstrapKey) {
		AuthResponseDto authResponse = authService.bootstrap(bootstrapKey);
		if (authResponse != null) {
			return ResponseEntity.ok(authResponse);
		}
		return ResponseEntity.status(HttpStatus.LOCKED).build();
	}
}
