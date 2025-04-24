package sigcaps.service;

import java.security.Key;
import java.security.SecureRandom;
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
		return Jwts.builder()
				.setSubject(accessKey)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
				.signWith(getSigningKey(), SignatureAlgorithm.HS256)
				.compact();
	}

	public String generateRefreshToken(String accessKey) {
		return Jwts.builder()
				.setSubject(accessKey)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME))
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

			return claims.getExpiration().after(new Date());

		} catch (Exception e) {
			return false;
		}
	}

	public String getAccessKeyFromToken(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
				.parseClaimsJws(token).getBody().getSubject();
	}

	private static String generateSecretKey() {
		byte[] key = new byte[32]; // 256 bits
		new SecureRandom().nextBytes(key);
		return Base64.getEncoder().encodeToString(key);
	}
}
