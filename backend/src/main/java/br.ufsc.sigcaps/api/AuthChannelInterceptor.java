package br.ufsc.sigcaps.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;
import br.ufsc.sigcaps.service.TokenService;

@Component
public class AuthChannelInterceptor implements ChannelInterceptor {

	@Autowired
	private TokenService tokenService;

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

		if (accessor.getCommand() == StompCommand.CONNECT) {
			String token = accessor.getFirstNativeHeader("Authorization");
			if (token == null || token.isEmpty()) {
				throw new IllegalArgumentException("Token não encontrado no cabeçalho Authorization!");
			}

			try {
				tokenService.validateToken(token);
			} catch (Exception e) {
				throw new IllegalArgumentException("Token inválido!", e);
			}
		}

		return message;
	}
}
