package sigcaps.service;

import java.util.List;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sigcaps.repository.HistoricoChamadosRepository;
import sigcaps.repository.model.HistoricoChamados;
import sigcaps.service.model.ChamadaPacienteDto;
import sigcaps.service.model.HistoricoChamadosDto;

@Service
public class HistoricoChamadosService {

	@Autowired
	private HistoricoChamadosRepository repository;

	public void convertAndSave(ChamadaPacienteDto dto) {
		HistoricoChamados historico = new HistoricoChamados();
		historico.setId(new ObjectId().toString());
		historico.setNomePaciente(dto.getNomePaciente());
		historico.setClassificacao(dto.getClassificacao());
		historico.setHorario(dto.getHorario());
		historico.setTiposServico(dto.getTipoServico());

		this.save(historico);
	}

	public void save(HistoricoChamados historico) {
		repository.save(historico);
	}

	public List<HistoricoChamados> getUltimos10Registros() {
		return repository.findTop10ByOrderByIdDesc();
	}
}
