package sigcaps.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import sigcaps.model.dto.ChamadaPacienteDto;
import sigcaps.service.ApplicationService;

@Controller
public class WebSocketController {

	@Autowired
	private ApplicationService applicationService;

	private final SimpMessagingTemplate messagingTemplate;

	public WebSocketController(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	@MessageMapping("/chamadaPacient[e")
	public void handleChamadaPaciente(ChamadaPacienteDto input) {
		ChamadaPacienteDto output = applicationService.chamarPaciente(input);
		messagingTemplate.convertAndSend("/topic/chamadaPaciente", output);
	}
}
