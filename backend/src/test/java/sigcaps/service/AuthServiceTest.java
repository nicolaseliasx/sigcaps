//package sigcaps.service;
//
//import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertThrows;
//import static org.mockito.Mockito.doNothing;
//import static org.mockito.Mockito.doThrow;
//import static org.mockito.Mockito.mock;
//import static org.mockito.Mockito.when;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import io.jsonwebtoken.JwtException;
//
//public class AuthServiceTest {
//
//	private UserService userService;
//
//	private AuthService authService;
//
//	private TokenService tokenService;
//
//	@BeforeEach
//	void setup() {
//		userService = mock();
//		tokenService = mock();
//		authService = new AuthService(userService, tokenService);
//	}
//
//	@Test
//	void validateTokenOrThrow_withValidToken_doesNotThrowException() {
//		String validToken = "valid.token.here";
//
//		doNothing().when(tokenService).validateToken(validToken);
//
//		assertDoesNotThrow(() -> authService.validateTokenOrThrow(validToken));
//	}
//
//	@Test
//	void validateTokenOrThrow_withInvalidToken_throwsIllegalArgumentException() {
//		String invalidToken = "invalid.token.here";
//
//		doThrow(new JwtException("Invalid token")).when(tokenService).validateToken(invalidToken);
//
//		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
//				() -> authService.validateTokenOrThrow(invalidToken));
//		assertEquals("Invalid token", exception.getMessage());
//	}
//
//	@Test
//	void generateToken_withValidSuperUserCredentials_returnsToken() {
//		String username = "superuser";
//		String password = "password123";
//
//		String expected = "generated.token";
//
//		when(userService.validateSuperUser(username, password)).thenReturn(true);
//
//		when(tokenService.generateToken(username, "superuser")).thenReturn(expected);
//
//		String token = authService.generateToken(username, password);
//
//		assertEquals(expected, token);
//	}
//
//	@Test
//	void generateToken_withInvalidCredentials_returnsInvalidCredentialsMessage() {
//		String username = "wronguser";
//		String password = "wrongpassword";
//
//		when(userService.validateSuperUser(username, password)).thenReturn(false);
//
//		Exception exception = assertThrows(IllegalArgumentException.class, () -> {
//			authService.generateToken(username, password);
//		});
//
//		assertEquals("Invalid credentials!", exception.getMessage());
//	}
//}
