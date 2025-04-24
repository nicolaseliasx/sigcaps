package sigcaps.service;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sigcaps.repository.model.HistoricoChamados;
import sigcaps.service.model.ChamadaPacienteDto;

@Service
public class ChamadaPacienteService {

	@Autowired
	private HistoricoChamadosService historicoService;

	@Autowired
	private MessagingService messagingService;

	public void chamarPaciente(ChamadaPacienteDto dto) {
		// Tentar usar clock para conseguir testar
		dto.setHorario(LocalDateTime.now());
		this.saveHistorico(dto);
		dto.setHistorico(historicoService.getUltimos10Registros().stream().map(document -> historicoService.convertToDto(document)).toList());

		messagingService.convertAndSend("/topic/chamadaPaciente", dto);
	}

	private void saveHistorico(ChamadaPacienteDto dto) {
		HistoricoChamados historico = new HistoricoChamados();
		historico.setNomePaciente(dto.getNomePaciente());
		historico.setClassificacao(dto.getClassificacao());
		historico.setTiposServico(dto.getTipoServico());
		historico.setHorario(dto.getHorario());

		historicoService.save(historico);
	}
}
