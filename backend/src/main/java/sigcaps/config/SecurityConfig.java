package sigcaps.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import sigcaps.api.secutiry.RestJwtFilter;
import sigcaps.service.TokenService;

@Configuration
public class SecurityConfig {

	@Bean
	public RestJwtFilter restJwtFilter(TokenService tokenService) {
		return new RestJwtFilter(tokenService);
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, RestJwtFilter restJwtFilter) throws Exception {
		http
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.csrf(AbstractHttpConfigurer::disable)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers(
								"/auth/authenticate",
								"/auth/refresh",
								"/auth/bootstrap",
								"/api/health/status",
								"/error",
								"/",
								"/index.html",
								"/assets/**",
								"/css/**",
								"/js/**",
								"/ws/**"
						).permitAll()
						.anyRequest().authenticated()
				)
				.addFilterBefore(restJwtFilter, AuthorizationFilter.class)
				.anonymous(AbstractHttpConfigurer::disable)
				.formLogin(AbstractHttpConfigurer::disable);

		return http.build();
	}

	@Bean
	public CorsFilter corsFilter() {
		return new CorsFilter(corsConfigurationSource());
	}

	@Bean
	public UrlBasedCorsConfigurationSource corsConfigurationSource() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();

		config.setAllowedOriginPatterns(List.of("*"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
		config.setAllowCredentials(true);

		source.registerCorsConfiguration("/**", config);
		return source;
	}
}
