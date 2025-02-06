package br.ufsc.sigcaps.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import br.ufsc.sigcaps.model.dto.ChamadaPacienteDto;
import br.ufsc.sigcaps.model.dto.ConfigDto;
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
