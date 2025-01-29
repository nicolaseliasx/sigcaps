package br.ufsc.sigcaps.service;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.ufsc.sigcaps.model.document.HistoricoChamadosDocument;
import br.ufsc.sigcaps.model.dto.ChamadaPacienteDto;
import br.ufsc.sigcaps.model.dto.ConfigDto;

@Service
public class ApplicationService {

	@Autowired
	private AuthService authService;

	@Autowired
	private HistoricoChamadosService historicoService;

	public ChamadaPacienteDto chamarPaciente(ChamadaPacienteDto dto) {
		dto.setHorario(LocalDateTime.now());

		this.saveHistorico(dto);

		dto.setHistorico(historicoService.getUltimos10Registros().stream().map(document -> historicoService.convertToDto(document)).toList());

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

	private void saveHistorico(ChamadaPacienteDto dto) {
		HistoricoChamadosDocument historico = new HistoricoChamadosDocument();
		historico.setNomePaciente(dto.getNomePaciente());
		historico.setClassificacao(dto.getClassificacao());
		historico.setTipoServico(dto.getTipoServico());
		historico.setHorario(dto.getHorario());

		historicoService.save(historico);
	}

}
