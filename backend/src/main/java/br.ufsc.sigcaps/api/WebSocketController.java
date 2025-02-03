package br.ufsc.sigcaps.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import br.ufsc.sigcaps.model.dto.ChamadaPacienteDto;
import br.ufsc.sigcaps.model.dto.ConfigDto;
import br.ufsc.sigcaps.model.dto.CredentialsDto;
import br.ufsc.sigcaps.service.ApplicationService;
import br.ufsc.sigcaps.service.TokenService;

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

	@MessageMapping("/chamadaPaciente")
	public void handleChamadaPaciente(ChamadaPacienteDto input) {
		ChamadaPacienteDto output = applicationService.chamarPaciente(input);
		messagingTemplate.convertAndSend("/topic/chamadaPaciente", output);
	}

	@MessageMapping("/config/save")
	public void handleSaveConfig(ConfigDto config) {
		applicationService.saveConfig(config);
		messagingTemplate.convertAndSend("/topic/config/load", config);
	}

	@MessageMapping("/config/load")
	public void handleLoadConfig() {
		ConfigDto output = applicationService.loadConfig();
		messagingTemplate.convertAndSend("/topic/config/load", output);
	}

	@MessageMapping("/generateToken")
	public void handleGenerateToken(CredentialsDto credentials, SimpMessageHeaderAccessor headerAccessor) {
		String sessionId = headerAccessor.getSessionId();
		messagingTemplate.convertAndSendToUser(sessionId, "/queue/generateToken", "TESTANDOENVIODETOKEN");
	}
}
