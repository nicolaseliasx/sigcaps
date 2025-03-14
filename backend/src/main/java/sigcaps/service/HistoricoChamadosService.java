package sigcaps.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sigcaps.repository.HistoricoChamadosRepository;
import sigcaps.repository.model.HistoricoChamados;
import sigcaps.service.model.HistoricoChamadosDto;

@Service
public class HistoricoChamadosService {

	@Autowired
	private HistoricoChamadosRepository repository;

	public void save(HistoricoChamados historico) {
		repository.save(historico);
	}

	public List<HistoricoChamados> getUltimos10Registros() {
		return repository.findTop10ByOrderByIdDesc();
	}

	public HistoricoChamadosDto convertToDto(HistoricoChamados document) {
		HistoricoChamadosDto dto = new HistoricoChamadosDto();
		dto.setNomePaciente(document.getNomePaciente());
		dto.setClassificacao(document.getClassificacao());
		dto.setHorario(document.getHorario());
		dto.setTipoServico(document.getTiposServico());
		return dto;
	}
}
