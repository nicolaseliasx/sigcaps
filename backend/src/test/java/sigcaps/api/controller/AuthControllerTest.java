package sigcaps.api.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import sigcaps.service.AuthService;
import sigcaps.service.model.AuthResponseDto;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

	@Mock
	private AuthService authService;

	@InjectMocks
	private AuthController authController;

	@Test
	void autenticar_ComChaveSecretaValida_DeveRetornarOk() {
		AuthResponseDto mockResponse = new AuthResponseDto();
		mockResponse.setToken("access123");
		mockResponse.setRefreshToken("refresh123");
		when(authService.authenticate("valid_key")).thenReturn(mockResponse);

		ResponseEntity<?> response = authController.authenticate("valid_key");

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(mockResponse, response.getBody());
	}

	@Test
	void autenticar_ComChaveSecretaInvalida_DeveRetornarNaoAutorizado() {
		when(authService.authenticate("invalid_key")).thenReturn(null);

		ResponseEntity<?> response = authController.authenticate("invalid_key");

		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("Chave secreta inválida.", response.getBody());
	}

	@Test
	void renovarToken_ComTokenValido_DeveRetornarNovosTokens() {
		AuthResponseDto mockResponse = new AuthResponseDto();
		mockResponse.setToken("new_access");
		mockResponse.setRefreshToken("new_refresh");
		when(authService.refresh("valid_refresh")).thenReturn(mockResponse);

		ResponseEntity<?> response = authController.refresh("valid_refresh");

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(mockResponse, response.getBody());
	}

	@Test
	void renovarToken_ComTokenInvalido_DeveRetornarNaoAutorizado() {
		when(authService.refresh("invalid_refresh")).thenReturn(null);

		ResponseEntity<?> response = authController.refresh("invalid_refresh");

		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals("RefreshToken inválido ou expirado.", response.getBody());
	}

	@Test
	void inicializar_ComChaveValida_DeveRetornarTokens() {
		AuthResponseDto mockResponse = new AuthResponseDto();
		mockResponse.setToken("boot_access");
		mockResponse.setRefreshToken("boot_refresh");
		when(authService.bootstrap("valid_bootstrap")).thenReturn(mockResponse);

		ResponseEntity<?> response = authController.bootstrap("valid_bootstrap");

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(mockResponse, response.getBody());
	}

	@Test
	void inicializar_ComChaveInvalida_DeveRetornarBloqueado() {
		when(authService.bootstrap("invalid_bootstrap")).thenReturn(null);

		ResponseEntity<?> response = authController.bootstrap("invalid_bootstrap");

		assertEquals(HttpStatus.LOCKED, response.getStatusCode());
		assertNull(response.getBody());
	}
}
