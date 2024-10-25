package br.ufsc.sigcaps.api;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import br.ufsc.sigcaps.model.ConfigDto;
import br.ufsc.sigcaps.model.InputDto;
import br.ufsc.sigcaps.model.OutputDto;

@Controller
public class WebSocketController {

	private final SimpMessagingTemplate messagingTemplate;

	public WebSocketController(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	@MessageMapping("/userMessage")
	public void handleUserMessage(InputDto message) {
		// Faz algo com a mensagem...
		String processedMessage = "Processed: " + message.getContent();

		// Envia para o frontend
		messagingTemplate.convertAndSend("/topic/frontendMessages", new OutputDto(processedMessage));
	}

	@MessageMapping("/config")
	public void configureAplication(ConfigDto configMessage) {
		// Lógica de configuração...
	}
}
