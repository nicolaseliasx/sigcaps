package sigcaps.api.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import sigcaps.api.secutiry.WebSocketJwtInterceptor;
import sigcaps.service.TokenService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WebSocketJwtInterceptorTest {

	@Mock
	private TokenService tokenService;

	@InjectMocks
	private WebSocketJwtInterceptor interceptor;

	@Test
	void devePermitirConexao_QuandoTokenValido() {
		String validToken = "token_valido";
		Message<?> message = createConnectMessage("Bearer " + validToken);

		when(tokenService.validateToken(validToken)).thenReturn(true);

		Message<?> result = interceptor.preSend(message, null);

		assertNotNull(result);
		verify(tokenService).validateToken(validToken);
	}

	@Test
	void deveBloquearConexao_QuandoTokenAusente() {
		Message<?> message = createConnectMessage(null);

		Exception exception = assertThrows(IllegalArgumentException.class, () -> {
			interceptor.preSend(message, null);
		});

		assertEquals("Token não encontrado!", exception.getMessage());
		verifyNoInteractions(tokenService);
	}

	@Test
	void deveBloquearConexao_QuandoTokenInvalido() {
		String invalidToken = "token_invalido";
		Message<?> message = createConnectMessage("Bearer " + invalidToken);

		when(tokenService.validateToken(invalidToken)).thenReturn(false);

		Exception exception = assertThrows(IllegalArgumentException.class, () -> {
			interceptor.preSend(message, null);
		});

		assertEquals("Token inválido.", exception.getMessage());
		verify(tokenService).validateToken(invalidToken);
	}

	@Test
	void deveIgnorarOutrosComandosDiferentesDeConnect() {
		Message<?> message = createMessage(StompCommand.SUBSCRIBE, "Bearer any_token");

		Message<?> result = interceptor.preSend(message, null);

		assertNotNull(result);
		verifyNoInteractions(tokenService);
	}

	private Message<?> createConnectMessage(String authorizationHeader) {
		return createMessage(StompCommand.CONNECT, authorizationHeader);
	}

	private Message<?> createMessage(StompCommand command, String authorization) {
		StompHeaderAccessor accessor = StompHeaderAccessor.create(command);
		if(authorization != null) {
			accessor.addNativeHeader("Authorization", authorization);
		}
		return MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());
	}
}
