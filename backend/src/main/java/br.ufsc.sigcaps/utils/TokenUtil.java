package br.ufsc.sigcaps.utils;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class TokenUtil {
    // TODO(@NICOLAS): ADICIONAR CHAVE SECRETA NO BANCO E DAR FETCH AQUI
    private static final String SECRET_KEY = "mySecretKeyMySecretKeyMySecretKeyMySecretKey";
    protected static final Key KEY = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public static String generateToken(String subject, String role) {
        return Jwts.builder()
                .setSubject(subject)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public static void validateToken(String token) throws JwtException {
        Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token);
    }
}
