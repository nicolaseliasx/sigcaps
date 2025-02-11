package sigcaps.api;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sigcaps.model.dto.ChangeCredentialsDto;
import sigcaps.model.dto.CredentialsDto;
import sigcaps.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	AuthService authService;

	@PostMapping("/generateToken")
	public ResponseEntity<?> generateToken(@RequestBody CredentialsDto credentials) {
		try {
			String token = this.authService.generateToken(credentials.getUsername(), credentials.getPassword());

			return ResponseEntity.ok().body(Map.of(
					"status", "sucesso",
					"token", token
			));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
					"status", "erro",
					"message", "Credenciais inválidas"
			));
		}
	}

	@PutMapping("/change")
	public ResponseEntity<?> changeCredentials(@RequestHeader("Authorization") String authorizationHeader, @RequestBody ChangeCredentialsDto changeCredentials) {
		String token = authorizationHeader.replace("Bearer ", "");
		try {
			this.authService.validateTokenOrThrow(token);

			boolean sucess = this.authService.changeSuperUser(changeCredentials);

			if (sucess) {
				return ResponseEntity.ok().body(Map.of("status", "sucesso"));
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
						"status", "erro",
						"message", "Credenciais inválidas"
				));
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity
					.status(HttpStatus.UNAUTHORIZED)
					.body(null);
		}
	}
}
