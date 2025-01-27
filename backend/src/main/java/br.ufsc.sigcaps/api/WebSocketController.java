package br.ufsc.sigcaps.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import br.ufsc.sigcaps.model.ConfigDto;
import br.ufsc.sigcaps.model.InputDto;
import br.ufsc.sigcaps.model.OutputDto;
import br.ufsc.sigcaps.service.ApplicationService;
import br.ufsc.sigcaps.utils.TokenService;

@Controller
public class WebSocketController {

	@Autowired
	private ApplicationService applicationService;

	@Autowired
	private TokenService tokenService;

	private final SimpMessagingTemplate messagingTemplate;

	public WebSocketController(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	@MessageMapping("/userMessage")
	public void handleUserMessage(InputDto message, @Header("Authorization") String token) {
		tokenService.validateToken(token);
		OutputDto msg = applicationService.userMessage(message);
		messagingTemplate.convertAndSend("/topic/frontendMessages", msg);
	}

	@MessageMapping("/config")
	public void handleConfigureAplication(ConfigDto configMessage) {
		applicationService.configureAplication(configMessage);
	}

	@MessageMapping("/requestToken")
	public void handleTokenRequest(String username, String password) {
		String msg = applicationService.tokenRequest(username, password);
		messagingTemplate.convertAndSend("/queue/tokenResponse", msg);
	}
}
