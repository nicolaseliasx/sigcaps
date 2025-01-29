package br.ufsc.sigcaps.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.ufsc.sigcaps.model.document.HistoricoChamadosDocument;
import br.ufsc.sigcaps.model.dto.HistoricoChamadosDto;
import br.ufsc.sigcaps.repository.HistoricoChamadosRepository;

@Service
public class HistoricoChamadosService {

	@Autowired
	private HistoricoChamadosRepository repository;

	public void save(HistoricoChamadosDocument historico) {
		repository.save(historico);
	}

	public List<HistoricoChamadosDocument> getUltimos10Registros() {
		return repository.findTop10ByOrderByIdDesc();
	}

	public HistoricoChamadosDto convertToDto(HistoricoChamadosDocument document) {
		HistoricoChamadosDto dto = new HistoricoChamadosDto();
		dto.setNomePaciente(document.getNomePaciente());
		dto.setClassificacao(document.getClassificacao());
		dto.setHorario(document.getHorario());
		return dto;
	}
}
