package br.ufsc.sigcaps.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import br.ufsc.sigcaps.utils.TokenUtil;
import io.jsonwebtoken.JwtException;

public class AuthServiceTest {

	private UserService userService;

	private AuthService authService;

	@BeforeEach
	void setup() {
		userService = mock();
		authService = new AuthService(userService);
	}

	@Test
	void validateTokenOrThrow_withValidToken_doesNotThrowException() {
		String validToken = "valid.token.here";

		try (var mockedStatic = mockStatic(TokenUtil.class)) {
			mockedStatic.when(() -> TokenUtil.validateToken(validToken)).thenAnswer(invocation -> null);

			assertDoesNotThrow(() -> authService.validateTokenOrThrow(validToken));
		}
	}

	@Test
	void validateTokenOrThrow_withInvalidToken_throwsIllegalArgumentException() {
		String invalidToken = "invalid.token.here";

		try (var mockedStatic = mockStatic(TokenUtil.class)) {
			mockedStatic.when(() -> TokenUtil.validateToken(invalidToken))
					.thenThrow(new JwtException("Invalid token"));

			IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
					() -> authService.validateTokenOrThrow(invalidToken));
			assertEquals("Invalid token", exception.getMessage());
		}
	}

	@Test
	void generateToken_withValidSuperUserCredentials_returnsToken() {
		String username = "superuser";
		String password = "password123";
		Map<String, String> credentials = Map.of("username", username, "password", password);

		try (var mockedStatic = mockStatic(TokenUtil.class)) {
			when(userService.validateSuperUser(username, password)).thenReturn(true);
			mockedStatic.when(() -> TokenUtil.generateToken(username, "superuser"))
					.thenReturn("generated.token");

			String token = authService.generateToken(credentials);

			assertEquals("generated.token", token);
		}
	}

	@Test
	void generateToken_withInvalidCredentials_returnsInvalidCredentialsMessage() {
		String username = "wronguser";
		String password = "wrongpassword";
		Map<String, String> credentials = Map.of("username", username, "password", password);

		when(userService.validateSuperUser(username, password)).thenReturn(false);

		String result = authService.generateToken(credentials);

		assertEquals("Invalid credentials", result);
	}
}
