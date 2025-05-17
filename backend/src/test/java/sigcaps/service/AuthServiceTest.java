package sigcaps.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;
import io.github.cdimascio.dotenv.Dotenv;
import sigcaps.repository.AuthKeyRepository;
import sigcaps.repository.BootstrapStatusRepository;
import sigcaps.repository.model.AuthKey;
import sigcaps.repository.model.BootstrapStatus;
import sigcaps.service.model.AuthResponseDto;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

	@Mock
	private AuthKeyRepository authKeyRepository;

	@Mock
	private BootstrapStatusRepository bootstrapStatusRepository;

	@Mock
	private TokenService tokenService;

	@InjectMocks
	private AuthService authService;

	private final String ACCESS_KEY = "test_access_key";
	private final String SECRET_KEY = "test_secret_key";
	private final String VALID_SIGNATURE = "valid_signature";
	private static final String BOOTSTRAP_KEY = "valid_bootstrap_key";
	private final String REFRESH_TOKEN = "valid_refresh_token";

	@BeforeEach
	void setUp() {
		AuthKey authKey = new AuthKey();
		authKey.setId(AuthService.UNIQUE_ID_AUTH);
		authKey.setAccessKey(ACCESS_KEY);

		BootstrapStatus bootstrapStatus = new BootstrapStatus();
		bootstrapStatus.setId(AuthService.UNIQUE_ID_BOOTSTRAP);
		bootstrapStatus.setUsed(false);

		lenient().when(authKeyRepository.findById(AuthService.UNIQUE_ID_AUTH))
				.thenReturn(Optional.of(authKey));

		lenient().when(bootstrapStatusRepository.findById(AuthService.UNIQUE_ID_BOOTSTRAP))
				.thenReturn(Optional.of(bootstrapStatus));
	}

	@Test
	void onApplicationReady_CriaRegistrosQuandoNaoExistem() {
		when(authKeyRepository.findById(AuthService.UNIQUE_ID_AUTH)).thenReturn(Optional.empty());
		when(bootstrapStatusRepository.findById(AuthService.UNIQUE_ID_BOOTSTRAP)).thenReturn(Optional.empty());

		authService.onApplicationReady();

		verify(authKeyRepository).save(any(AuthKey.class));
		verify(bootstrapStatusRepository).save(any(BootstrapStatus.class));
	}

	@Test
	void authenticate_RetornaTokensQuandoAssinaturaValida() {
		AuthKey authKey = new AuthKey();
		authKey.setId(AuthService.UNIQUE_ID_AUTH);
		authKey.setAccessKey(ACCESS_KEY);

		when(authKeyRepository.findById(AuthService.UNIQUE_ID_AUTH)).thenReturn(Optional.of(authKey));

		String secretKey = AuthService.generateSecretKey(ACCESS_KEY);
		String validSignature = AuthService.computeHmac(secretKey);

		AuthResponseDto mockResponse = new AuthResponseDto();
		mockResponse.setToken("new_jwt_token");
		mockResponse.setRefreshToken("new_refresh_token");

		when(tokenService.generateToken(ACCESS_KEY)).thenReturn(mockResponse.getToken());
		when(tokenService.generateRefreshToken(ACCESS_KEY)).thenReturn(mockResponse.getRefreshToken());

		AuthResponseDto response = authService.authenticate(validSignature);

		assertNotNull(response);
		assertEquals("new_jwt_token", response.getToken());
		assertEquals("new_refresh_token", response.getRefreshToken());
	}

	@Test
	void authenticate_LancaExcecaoQuandoAssinaturaInvalida() {
		assertThrows(SecurityException.class, () -> authService.authenticate("invalid_signature"));
	}

	@Test
	void bootstrap_RetornaTokensQuandoChaveValidaENaoUsada() {
		Dotenv mockDotenv = mock(Dotenv.class);
		when(mockDotenv.get("BOOTSTRAP_KEY")).thenReturn(BOOTSTRAP_KEY);

		ReflectionTestUtils.setField(authService, "dotenv", mockDotenv);

		BootstrapStatus status = new BootstrapStatus();
		status.setId(AuthService.UNIQUE_ID_BOOTSTRAP);
		status.setUsed(false);

		AuthKey authKey = new AuthKey();
		authKey.setId(AuthService.UNIQUE_ID_AUTH);
		authKey.setAccessKey(ACCESS_KEY);

		when(bootstrapStatusRepository.findById(AuthService.UNIQUE_ID_BOOTSTRAP))
				.thenReturn(Optional.of(status));

		when(authKeyRepository.findById(AuthService.UNIQUE_ID_AUTH))
				.thenReturn(Optional.of(authKey));

		when(tokenService.generateToken(ACCESS_KEY)).thenReturn("boot_jwt");
		when(tokenService.generateRefreshToken(ACCESS_KEY)).thenReturn("boot_refresh");

		AuthResponseDto response = authService.bootstrap(BOOTSTRAP_KEY);

		assertNotNull(response);
		assertEquals("boot_jwt", response.getToken());
		assertEquals("boot_refresh", response.getRefreshToken());
		verify(bootstrapStatusRepository).save(any(BootstrapStatus.class));
	}

	@Test
	void bootstrap_RetornaNullQuandoChaveInvalida() {
		Dotenv mockDotenv = mock(Dotenv.class);
		when(mockDotenv.get("BOOTSTRAP_KEY")).thenReturn(BOOTSTRAP_KEY); // Chave correta
		ReflectionTestUtils.setField(authService, "dotenv", mockDotenv);

		BootstrapStatus status = new BootstrapStatus();
		status.setId(AuthService.UNIQUE_ID_BOOTSTRAP);
		status.setUsed(false);
		when(bootstrapStatusRepository.findById(AuthService.UNIQUE_ID_BOOTSTRAP))
				.thenReturn(Optional.of(status));

		AuthResponseDto response = authService.bootstrap("chave_invalida_123");

		assertNull(response, "Deveria retornar null para chave inválida");
		verify(bootstrapStatusRepository, never()).save(any());
	}

	@Test
	void bootstrapTokenGenerate_RetornaTokensQuandoAuthKeyExiste() {
		when(tokenService.generateToken(ACCESS_KEY)).thenReturn("boot_jwt");
		when(tokenService.generateRefreshToken(ACCESS_KEY)).thenReturn("boot_refresh");

		AuthResponseDto response = authService.bootstrapTokenGenerate();

		assertNotNull(response);
		assertEquals("boot_jwt", response.getToken());
		assertEquals("boot_refresh", response.getRefreshToken());
	}

	@Test
	void refresh_RetornaNovosTokensQuandoRefreshTokenValido() {
		when(tokenService.validateToken(REFRESH_TOKEN)).thenReturn(true);
		when(tokenService.getAccessKeyFromToken(REFRESH_TOKEN)).thenReturn(ACCESS_KEY);
		when(tokenService.generateToken(ACCESS_KEY)).thenReturn("new_jwt");
		when(tokenService.generateRefreshToken(ACCESS_KEY)).thenReturn("new_refresh");

		AuthResponseDto response = authService.refresh(REFRESH_TOKEN);

		assertNotNull(response);
		assertEquals("new_jwt", response.getToken());
		assertEquals("new_refresh", response.getRefreshToken());
	}

	@Test
	void refresh_LancaExcecaoQuandoRefreshTokenInvalido() {
		when(tokenService.validateToken("invalid_token")).thenReturn(false);
		assertThrows(SecurityException.class, () -> authService.refresh("invalid_token"));
	}

	@Test
	void getAuthentication_RetornaAutenticacaoPadrao() {
		Authentication auth = authService.getAuthentication();
		assertNotNull(auth);
		assertEquals("API_CLIENT", auth.getPrincipal());
		assertTrue(auth.getAuthorities().isEmpty());
	}

	@Test
	void generateAccessKey_RetornaChaveBase64Valida() {
		String key = AuthService.generateAccessKey();
		assertNotNull(key);
		assertTrue(key.matches("^[a-zA-Z0-9-_]{43}$"));
	}

	@Test
	void generateSecretKey_RetornaChaveDerivadaCorreta() {
		String result = AuthService.generateSecretKey(ACCESS_KEY);
		assertNotNull(result);
		assertTrue(result.matches("^[a-zA-Z0-9-_]{43}$"));
	}
}
