package br.ufsc.sigcaps.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import br.ufsc.sigcaps.utils.TokenService;
import io.jsonwebtoken.JwtException;

@Service
@AllArgsConstructor
public class AuthService {
	// TODO(@NICOLAS): VERIFICAR COMO ISSO DEVE FICAR, A PARTE DOS @AUTOWIREDS
	private final UserService userService;
	private final TokenService tokenService;

	public void validateTokenOrThrow(String token) {
		try {
			tokenService.validateToken(token);
		} catch (JwtException e) {
			throw new IllegalArgumentException("Invalid token", e);
		}
	}

	public String generateToken(String username, String password) {
		if (userService.validateSuperUser(username, password)) {
			return tokenService.generateToken(username, "superuser");
		} else {
			return "Invalid credentials";
		}
	}
}
