package br.ufsc.sigcaps.api;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import br.ufsc.sigcaps.model.ConfigDto;
import br.ufsc.sigcaps.model.InputDto;
import br.ufsc.sigcaps.model.OutputDto;
import br.ufsc.sigcaps.utils.TokenUtil;
import br.ufsc.sigcaps.service.ApplicationService;

@Controller
public class WebSocketController {

	@Autowired
	private ApplicationService applicationService;

	private final SimpMessagingTemplate messagingTemplate;

	public WebSocketController(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	@MessageMapping("/userMessage")
	public void handleUserMessage(InputDto message) {
		TokenUtil.validateToken(message.getToken());
		OutputDto msg = applicationService.userMessage(message);
		messagingTemplate.convertAndSend("/topic/frontendMessages", msg);
	}

	@MessageMapping("/config")
	public void handleConfigureAplication(ConfigDto configMessage) {
		applicationService.configureAplication(configMessage);
	}

	@MessageMapping("/requestToken")
	public void handleTokenRequest(@Payload Map<String, String> credentials) {
		String msg = applicationService.tokenRequest(credentials);
		messagingTemplate.convertAndSend("/queue/tokenResponse", msg);
	}
}
