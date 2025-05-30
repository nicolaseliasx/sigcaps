package sigcaps.service;

import java.security.Key;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class TokenService {

	private final String SECRET_KEY = "0IscarAkdJwK1rd7TUWh1uKBHjOSLV2IWqYhstoxokk=";
	private final long EXPIRATION_TIME = TimeUnit.DAYS.toMillis(30);
	private final long REFRESH_EXPIRATION_TIME = TimeUnit.DAYS.toMillis(90);

	private Key getSigningKey() {
		return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
	}

	public String generateToken(String accessKey) {
		Instant now = Instant.now();
		Instant expiration = now.plus(EXPIRATION_TIME, ChronoUnit.MILLIS);

		return Jwts.builder()
				.setSubject(accessKey)
				.setIssuedAt(Date.from(now))
				.setExpiration(Date.from(expiration))
				.signWith(getSigningKey(), SignatureAlgorithm.HS256)
				.compact();
	}

	public String generateRefreshToken(String accessKey) {
		Instant now = Instant.now();
		Instant expiration = now.plus(REFRESH_EXPIRATION_TIME, ChronoUnit.MILLIS);

		return Jwts.builder()
				.setSubject(accessKey)
				.setIssuedAt(Date.from(now))
				.setExpiration(Date.from(expiration))
				.signWith(getSigningKey(), SignatureAlgorithm.HS256)
				.compact();
	}

	public boolean validateToken(String token) {
		if (token == null || token.isBlank()) {
			return false;
		}

		try {
			Claims claims = Jwts.parserBuilder()
					.setSigningKey(getSigningKey())
					.build()
					.parseClaimsJws(token)
					.getBody();

			Instant expiration = claims.getExpiration().toInstant();
			return expiration.isAfter(Instant.now());

		} catch (Exception e) {
			return false;
		}
	}

	public String getAccessKeyFromToken(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
				.parseClaimsJws(token).getBody().getSubject();
	}
}
