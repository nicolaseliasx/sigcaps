package br.ufsc.sigcaps.service;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.ufsc.sigcaps.utils.TokenUtil;
import io.jsonwebtoken.JwtException;

@Service
public class AuthService {
	// TODO(@NICOLAS): VERIFICAR COMO ISSO DEVE FICAR, A PARTE DOS @AUTOWIREDS
	private final UserService userService;

	@Autowired
	public AuthService(UserService userService) {
		this.userService = userService;
	}

	public void validateTokenOrThrow(String token) {
		try {
			TokenUtil.validateToken(token);
		} catch (JwtException e) {
			throw new IllegalArgumentException("Invalid token", e);
		}
	}

	public String generateToken(Map<String, String> credentials) {
		String username = credentials.get("username");
		String password = credentials.get("password");

		if (userService.validateSuperUser(username, password)) {
			return TokenUtil.generateToken(username, "superuser");
		} else {
			return "Invalid credentials";
		}
	}
}
