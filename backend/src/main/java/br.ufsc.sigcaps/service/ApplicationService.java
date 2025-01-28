package br.ufsc.sigcaps.service;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.ufsc.sigcaps.model.ChamadaPacienteDto;
import br.ufsc.sigcaps.model.ConfigDto;

@Service
public class ApplicationService {

	@Autowired
	private AuthService authService;

	public ChamadaPacienteDto userMessage(ChamadaPacienteDto dto) {
		// Salvar no banco de historico antes de devolver pro front
		dto.setHorario(LocalDateTime.now().toString());
		return dto;
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
