package sigcaps.service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Collections;
import java.util.Objects;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import io.github.cdimascio.dotenv.Dotenv;
import sigcaps.repository.AuthKeyRepository;
import sigcaps.repository.BootstrapStatusRepository;
import sigcaps.repository.model.AuthKey;
import sigcaps.repository.model.BootstrapStatus;
import sigcaps.service.model.AuthResponseDto;

@Service
public class AuthService {

	private static final String UNIQUE_ID_AUTH = "sigcaps-primary-key-auth";
	private static final String UNIQUE_ID_BOOTSTRAP = "sigcaps-primary-key-bootstrap_status";
	private static final String HMAC_ALGORITHM = "HmacSHA256";
	private static final String FIXED_CHALLENGE = "SIGCAPS-AUTH";

	@Autowired
	private AuthKeyRepository authKeyRepository;

	@Autowired
	private BootstrapStatusRepository bootstrapStatusRepository;

	@Autowired
	private TokenService tokenService;

	private static final Dotenv dotenv = Dotenv.load();

	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		if (authKeyRepository.findById(UNIQUE_ID_AUTH).isEmpty()) {
			AuthKey newAuthKey = generateAuthKey();
			authKeyRepository.save(newAuthKey);
		}
		if (bootstrapStatusRepository.findById(UNIQUE_ID_BOOTSTRAP).isEmpty()) {
			BootstrapStatus newBootstrapStatus = new BootstrapStatus();
			newBootstrapStatus.setId(UNIQUE_ID_BOOTSTRAP);
			newBootstrapStatus.setUsed(false);
			bootstrapStatusRepository.save(newBootstrapStatus);
		}
	}

	public AuthResponseDto authenticate(String clientSignature) {
		AuthKey authKey = authKeyRepository.findById(UNIQUE_ID_AUTH)
				.orElseThrow(() -> new SecurityException("Chave de autenticação não encontrada."));

		String accessKey = authKey.getAccessKey();
		String secretKey = generateSecretKey(accessKey);

		String validSignature = computeHmac(secretKey);

		if (!validSignature.equals(clientSignature)) {
			throw new SecurityException("Assinatura inválida.");
		}

		return generateTokens(accessKey);
	}

	private AuthResponseDto generateTokens(String accessKey) {
		String jwtToken = tokenService.generateToken(accessKey);
		String refreshToken = tokenService.generateRefreshToken(accessKey);

		AuthResponseDto dto = new AuthResponseDto();
		dto.setToken(jwtToken);
		dto.setRefreshToken(refreshToken);

		return dto;
	}

	private String computeHmac(String secretKey) {
		try {
			Mac mac = Mac.getInstance(HMAC_ALGORITHM);
			SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), HMAC_ALGORITHM);
			mac.init(keySpec);
			byte[] hash = mac.doFinal(AuthService.FIXED_CHALLENGE.getBytes());
			return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
		} catch (Exception e) {
			throw new RuntimeException("Erro ao calcular HMAC", e);
		}
	}

	public AuthResponseDto bootstrap(String bootstrapKey) {
		BootstrapStatus status = bootstrapStatusRepository.findById(UNIQUE_ID_BOOTSTRAP)
				.orElseThrow(() -> new RuntimeException("BootstrapStatus não encontrado."));

		if (!status.isUsed() && Objects.equals(bootstrapKey, dotenv.get("BOOTSTRAP_KEY"))) {
			BootstrapStatus newBootstrapStatus = new BootstrapStatus();
			newBootstrapStatus.setId(UNIQUE_ID_BOOTSTRAP);
			newBootstrapStatus.setUsed(true);
			bootstrapStatusRepository.save(newBootstrapStatus);

			return this.bootstrapTokenGenerate();
		}

		return null;
	}

	public AuthResponseDto bootstrapTokenGenerate() {
		AuthKey authKey = authKeyRepository.findById(UNIQUE_ID_AUTH)
				.orElseThrow(() -> new RuntimeException("AuthKey não encontrado."));

		String accessKey = authKey.getAccessKey();

		return this.generateTokens(accessKey);
	}

	public AuthResponseDto refresh(String refreshToken) {
		if (!tokenService.validateToken(refreshToken)) {
			throw new SecurityException("Refresh token inválido ou expirado");
		}

		String accessKey = tokenService.getAccessKeyFromToken(refreshToken);
		String newToken = tokenService.generateToken(accessKey);
		String newRefreshToken = tokenService.generateRefreshToken(accessKey);

		AuthResponseDto dto = new AuthResponseDto();
		dto.setToken(newToken);
		dto.setRefreshToken(newRefreshToken);

		return dto;
	}

	private AuthKey generateAuthKey() {
		String accessKey = generateAccessKey();
		AuthKey authKey = new AuthKey();
		authKey.setId(UNIQUE_ID_AUTH);
		authKey.setAccessKey(accessKey);
		return authKey;
	}

	public static String generateAccessKey() {
		return generateRandomKey();
	}

	private static String generateRandomKey() {
		byte[] randomBytes = new byte[32];
		new SecureRandom().nextBytes(randomBytes);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
	}

	public static String generateSecretKey(String accessKey) {
		try {
			Mac mac = Mac.getInstance(HMAC_ALGORITHM);
			SecretKeySpec keySpec = new SecretKeySpec(accessKey.getBytes(), HMAC_ALGORITHM);
			mac.init(keySpec);
			byte[] hash = mac.doFinal((accessKey + "-sigcaps").getBytes());
			return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
		} catch (Exception e) {
			throw new RuntimeException("Erro ao gerar Secret Key", e);
		}
	}

	public Authentication getAuthentication() {
		return new UsernamePasswordAuthenticationToken(
				"API_CLIENT",
				null,
				Collections.emptyList()
		);
	}
}
