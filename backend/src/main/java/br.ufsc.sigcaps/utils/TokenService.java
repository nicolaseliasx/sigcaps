package br.ufsc.sigcaps.utils;

import java.security.Key;
import java.util.Date;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class TokenService {
	private static final String SECRET_KEY = "579eb9c51f49b3e9a7cf87784adce0c6ca5045d7756a09e026baa4d86b10e5fe";
	protected static final Key KEY = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

	public String generateToken(String subject, String role) {
		int duration = 3600000;
		return Jwts.builder()
				.setSubject(subject)
				.claim("role", role)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + duration))
				.signWith(KEY, SignatureAlgorithm.HS256)
				.compact();
	}

	public void validateToken(String token) throws JwtException {
		Jwts.parserBuilder()
				.setSigningKey(KEY)
				.build()
				.parseClaimsJws(token);
	}
}
