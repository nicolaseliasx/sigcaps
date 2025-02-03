package br.ufsc.sigcaps.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.JwtException;

@Service
@AllArgsConstructor
public class AuthService {
	@Autowired
	private UserService userService;
	@Autowired
	private TokenService tokenService;

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
			throw new IllegalArgumentException("Invalid credentials!");
		}
	}
}
