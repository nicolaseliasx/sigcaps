package br.ufsc.sigcaps.api;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.ufsc.sigcaps.model.dto.CredentialsDto;
import br.ufsc.sigcaps.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

	@Autowired
	AuthService authService;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody CredentialsDto credentials) {
		try {
			String token = authService.generateToken(credentials.getUsername(), credentials.getPassword());

			return ResponseEntity.ok().body(Map.of(
					"status", "sucesso",
					"token", token
			));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(401).body(Map.of(
					"status", "erro",
					"mensagem", "Credenciais inválidas"
			));
		}

	}
}
