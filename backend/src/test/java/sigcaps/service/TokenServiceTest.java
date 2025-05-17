package sigcaps.service;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TokenServiceTest {

	private final TokenService tokenService = new TokenService();
	private final String SECRET_KEY = "0IscarAkdJwK1rd7TUWh1uKBHjOSLV2IWqYhstoxokk=";

	@Test
	void generateToken_ShouldReturnValidJwtWithAccessKey() {
		String accessKey = "testAccessKey";
		String token = tokenService.generateToken(accessKey);

		assertNotNull(token);
		assertEquals(accessKey, tokenService.getAccessKeyFromToken(token));
	}

	@Test
	void generateRefreshToken_ShouldReturnValidJwtWithAccessKey() {
		String accessKey = "testAccessKey";
		String refreshToken = tokenService.generateRefreshToken(accessKey);

		assertNotNull(refreshToken);
		assertEquals(accessKey, tokenService.getAccessKeyFromToken(refreshToken));
	}

	@Test
	void validateToken_ShouldReturnTrueForValidToken() {
		String token = tokenService.generateToken("test");
		assertTrue(tokenService.validateToken(token));
	}

	@Test
	void validateToken_ShouldReturnFalseForExpiredToken() throws Exception {
		Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
		String expiredToken = Jwts.builder()
				.setSubject("test")
				.setIssuedAt(Date.from(Instant.now().minus(2, ChronoUnit.DAYS)))
				.setExpiration(Date.from(Instant.now().minus(1, ChronoUnit.DAYS)))
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();

		assertFalse(tokenService.validateToken(expiredToken));
	}

	@Test
	void validateToken_ShouldReturnFalseForInvalidToken() {
		assertFalse(tokenService.validateToken("invalid_token"));
	}

	@Test
	void validateToken_ShouldReturnFalseForNullToken() {
		assertFalse(tokenService.validateToken(null));
	}

	@Test
	void validateToken_ShouldReturnFalseForTamperedToken() {
		String validToken = tokenService.generateToken("test");
		String tamperedToken = validToken + "tamper";

		assertFalse(tokenService.validateToken(tamperedToken));
	}

	@Test
	void getAccessKeyFromToken_ShouldReturnSubjectForValidToken() {
		String accessKey = "testUser";
		String token = tokenService.generateToken(accessKey);

		assertEquals(accessKey, tokenService.getAccessKeyFromToken(token));
	}

	@Test
	void getAccessKeyFromToken_ShouldThrowForInvalidToken() {
		assertThrows(JwtException.class, () ->
				tokenService.getAccessKeyFromToken("invalid.token.here"));
	}
}
