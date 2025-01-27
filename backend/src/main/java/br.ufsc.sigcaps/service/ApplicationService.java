package br.ufsc.sigcaps.service;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;
import br.ufsc.sigcaps.model.ConfigDto;
import br.ufsc.sigcaps.model.InputDto;
import br.ufsc.sigcaps.model.OutputDto;

@Service
public class ApplicationService {

	@Autowired
	private AuthService authService;

	public OutputDto userMessage(InputDto message) {
		// add logica de chamar parte de audio
		return new OutputDto(message.getContent());
	}

	public String tokenRequest(String username, String password) {
		return authService.generateToken(username, password);
	}

	public void configureAplication(ConfigDto configMessage) {
		// Lógica de configuração...
		// Adicionar todos os campos configuraveis no Config Dto
		// Dar um load na entidade atual de configuracao
		// Setar todos os valores de config novos
		// Salvar no banco
	}
}
