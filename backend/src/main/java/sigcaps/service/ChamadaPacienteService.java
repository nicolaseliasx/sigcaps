package sigcaps.service;

import java.time.Clock;
import java.time.LocalDateTime;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sigcaps.repository.model.HistoricoChamados;
import sigcaps.service.model.ChamadaPacienteDto;
import sigcaps.service.model.HistoricoChamadosDto;

@Service
public class ChamadaPacienteService {

	@Autowired
	private HistoricoChamadosService historicoService;

	@Autowired
	private MessagingService messagingService;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private Clock clock;

	public void chamarPaciente(ChamadaPacienteDto dto) {
		dto.setHorario(LocalDateTime.now(clock));
		historicoService.convertAndSave(dto);
		dto.setHistorico(historicoService.getUltimos10Registros().stream().map(
				document -> {
					HistoricoChamadosDto historicoDto = new HistoricoChamadosDto();
					historicoDto.setNomePaciente(document.getNomePaciente());
					historicoDto.setClassificacao(document.getClassificacao());
					historicoDto.setHorario(document.getHorario());
					historicoDto.setTipoServico(document.getTiposServico());
					return historicoDto;
				}
		).toList());
		messagingService.convertAndSend("/topic/chamadaPaciente", dto);
	}
}
