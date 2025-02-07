package sigcaps.service;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sigcaps.model.document.ConfigDocument;
import sigcaps.model.document.HistoricoChamadosDocument;
import sigcaps.model.dto.ChamadaPacienteDto;
import sigcaps.model.dto.ConfigDto;

@Service
public class ApplicationService {

	@Autowired
	private AuthService authService;

	@Autowired
	private HistoricoChamadosService historicoService;

	@Autowired
	private ConfigService configService;

	public ChamadaPacienteDto chamarPaciente(ChamadaPacienteDto dto) {
		// Tentar usar clock pra conseguir testar
		dto.setHorario(LocalDateTime.now());

		this.saveHistorico(dto);

		dto.setHistorico(historicoService.getUltimos10Registros().stream().map(document -> historicoService.convertToDto(document)).toList());

		return dto;
	}

	public void saveConfig(ConfigDto config) {
		configService.save(configService.convertToDocument(config));
	}

	public ConfigDto loadConfig() {
		Optional<ConfigDocument> optionalConfig = configService.load();
		if (optionalConfig.isEmpty()) {
			throw new RuntimeException("Config not found");
		}
		ConfigDocument config = optionalConfig.get();

		return configService.convertToDto(config);
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
