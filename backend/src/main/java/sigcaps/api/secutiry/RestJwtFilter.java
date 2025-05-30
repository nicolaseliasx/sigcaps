package sigcaps.api.secutiry;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import sigcaps.service.AuthService;
import sigcaps.service.TokenService;

@Component
public class RestJwtFilter extends OncePerRequestFilter {

	private final TokenService tokenService;

	@Autowired
	private AuthService authService;

	public RestJwtFilter(TokenService tokenService) {
		this.tokenService = tokenService;
	}

	private final List<String> excludedAntPatterns = Arrays.asList(
			"/",
			"/index.html",
			"/auth/authenticate",
			"/auth/refresh",
			"/auth/bootstrap",
			"/api/health/status",
			"/error",
			"/ws/**",
			"/assets/**",
			"/css/**",
			"/js/**",
			"/favicon.ico",
			"/v3/api-docs/**",
			"/swagger-ui/**",
			"/swagger-resources/**",
			"/swagger-ui.html"
	);

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String authHeader = request.getHeader("Authorization");

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token não encontrado ou inválido");
			return;
		}

		String token = authHeader.replace("Bearer ", "");
		if (!tokenService.validateToken(token)) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido ou expirado");
			return;
		}

		Authentication authentication = authService.getAuthentication();
		SecurityContextHolder.getContext().setAuthentication(authentication);

		filterChain.doFilter(request, response);
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		String path = request.getRequestURI();
		AntPathMatcher pathMatcher = new AntPathMatcher();

		return excludedAntPatterns.stream()
				.anyMatch(pattern -> pathMatcher.match(pattern, path));
	}
}
