package sigcaps.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import sigcaps.service.ChamadaPacienteService;
import sigcaps.service.model.ChamadaPacienteDto;

@Controller
public class WebSocketController {

	@Autowired
	private ChamadaPacienteService chamadaPacienteService;

	@MessageMapping("/chamadaPaciente")
	public void handleChamadaPaciente(ChamadaPacienteDto input) {
		this.chamadaPacienteService.chamarPaciente(input);
	}
}
