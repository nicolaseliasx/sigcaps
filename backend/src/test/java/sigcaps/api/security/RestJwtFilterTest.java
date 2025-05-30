package sigcaps.api.security;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import sigcaps.api.secutiry.RestJwtFilter;
import sigcaps.service.AuthService;
import sigcaps.service.TokenService;

import jakarta.servlet.FilterChain;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RestJwtFilterTest {

	private RestJwtFilter restJwtFilter;
	private MockHttpServletRequest request;
	private MockHttpServletResponse response;
	private FilterChain filterChain;

	@Mock
	private TokenService tokenService;

	@Mock
	private AuthService authService;

	@BeforeEach
	void setUp() throws Exception {
		restJwtFilter = new RestJwtFilter(tokenService);

		Field authServiceField = RestJwtFilter.class.getDeclaredField("authService");
		authServiceField.setAccessible(true);
		authServiceField.set(restJwtFilter, authService);

		request = new MockHttpServletRequest();
		response = new MockHttpServletResponse();
		filterChain = mock(FilterChain.class);
	}

	@AfterEach
	void tearDown() {
		SecurityContextHolder.clearContext();
	}

	@ParameterizedTest
	@MethodSource("urlsExcluidasProvider")
	void naoDeveFiltrar_QuandoUrlEstaNaListaDeExcecoes(String url) throws Exception {
		request.setRequestURI(url);

		Method shouldNotFilter = RestJwtFilter.class.getDeclaredMethod("shouldNotFilter", HttpServletRequest.class);
		shouldNotFilter.setAccessible(true);
		boolean resultado = (Boolean) shouldNotFilter.invoke(restJwtFilter, request);

		assertTrue(resultado);
	}

	private static Stream<String> urlsExcluidasProvider() {
		return Stream.of(
				"/",
				"/index.html",
				"/auth/authenticate",
				"/api/health/status",
				"/ws/chat",
				"/assets/image.png",
				"/css/style.css",
				"/js/app.js",
				"/favicon.ico"
		);
	}

	@Test
	void deveRetornarNaoAutorizado_QuandoCabecalhoAuthorizationAusente() throws Exception {
		request.setRequestURI("/api/protegido");

		restJwtFilter.doFilter(request, response, filterChain);

		assertEquals(401, response.getStatus());
		verifyNoInteractions(filterChain);
	}

	@Test
	void deveRetornarNaoAutorizado_QuandoTokenInvalido() throws Exception {
		request.setRequestURI("/api/protegido");
		request.addHeader("Authorization", "Bearer token_invalido");
		when(tokenService.validateToken("token_invalido")).thenReturn(false);

		restJwtFilter.doFilter(request, response, filterChain);

		assertEquals(401, response.getStatus());
		verifyNoInteractions(filterChain);
	}

	@Test
	void deveConfigurarAutenticacao_QuandoTokenValido() throws Exception {
		request.setRequestURI("/api/protegido");
		request.addHeader("Authorization", "Bearer token_valido");

		Authentication mockAuth = mock(Authentication.class);
		when(authService.getAuthentication()).thenReturn(mockAuth);
		when(tokenService.validateToken("token_valido")).thenReturn(true);

		restJwtFilter.doFilter(request, response, filterChain);

		verify(authService).getAuthentication();
		verify(filterChain).doFilter(request, response);

		assertEquals(mockAuth, SecurityContextHolder.getContext().getAuthentication());
	}

	@Test
	void deveRetornarNaoAutorizado_QuandoPrefixoBearerAusente() throws Exception {
		request.setRequestURI("/api/protegido");
		request.addHeader("Authorization", "TokenInvalido");

		restJwtFilter.doFilter(request, response, filterChain);

		assertEquals(401, response.getStatus());
		verifyNoInteractions(filterChain);
	}
}
