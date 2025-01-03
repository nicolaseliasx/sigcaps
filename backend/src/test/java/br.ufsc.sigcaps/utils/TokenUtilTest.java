package br.ufsc.sigcaps.utils;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

public class TokenUtilTest {
	@Test
	void shouldGenerateValidToken() {
		String subject = "test-user";
		String role = "admin";

		String token = TokenUtil.generateToken(subject, role);

		assertNotNull(token, "Generated token should not be null");
		assertFalse(token.isEmpty(), "Generated token should not be empty");
	}

	@Test
	void shouldValidateValidToken() {
		String subject = "test-user";
		String role = "admin";
		String token = TokenUtil.generateToken(subject, role);

		assertDoesNotThrow(() -> TokenUtil.validateToken(token), "Valid token should not throw exceptions");
	}

	@Test
	void shouldThrowExceptionForInvalidToken() {
		String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + // Header válido
				"eyJzdWIiOiJ1c2VyMTIzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjc1Mzc0NzE4fQ." + // Payload válido
				"invalidsignature"; // Assinatura inválida

		JwtException exception = assertThrows(JwtException.class, () -> TokenUtil.validateToken(invalidToken),
				"Invalid token should throw JwtException");

		assertTrue(exception.getMessage().contains("JWT signature does not match"),
				"Exception message should indicate invalid signature");
	}

	@Test
	void shouldIncludeSubjectAndRoleInGeneratedToken() {
		String subject = "test-user";
		String role = "admin";

		String token = TokenUtil.generateToken(subject, role);

		String parsedSubject = Jwts.parserBuilder()
				.setSigningKey(TokenUtil.KEY)
				.build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();

		String parsedRole = Jwts.parserBuilder()
				.setSigningKey(TokenUtil.KEY)
				.build()
				.parseClaimsJws(token)
				.getBody()
				.get("role", String.class);

		assertEquals(subject, parsedSubject, "The subject in the token should match the original subject");
		assertEquals(role, parsedRole, "The role in the token should match the original role");
	}
}
