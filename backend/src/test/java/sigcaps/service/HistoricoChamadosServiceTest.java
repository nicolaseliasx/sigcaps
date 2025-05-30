package sigcaps.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import sigcaps.repository.HistoricoChamadosRepository;
import sigcaps.repository.model.HistoricoChamados;
import sigcaps.service.model.ChamadaPacienteDto;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HistoricoChamadosServiceTest {

	@Mock
	private HistoricoChamadosRepository repository;

	@InjectMocks
	private HistoricoChamadosService service;

	@Test
	void save_DeveSalvarNoRepositorio() {
		HistoricoChamados historico = new HistoricoChamados();
		historico.setId("123");

		service.save(historico);

		verify(repository).save(historico);
	}

	@Test
	void getUltimos10Registros_DeveRetornarListaDoRepositorio() {
		List<HistoricoChamados> mockList = List.of(
				createHistorico("1", "Paciente 1"),
				createHistorico("2", "Paciente 2")
		);

		when(repository.findTop10ByOrderByIdDesc()).thenReturn(mockList);

		List<HistoricoChamados> result = service.getUltimos10Registros();

		assertEquals(2, result.size());
		assertEquals("Paciente 1", result.get(0).getNomePaciente());
		verify(repository).findTop10ByOrderByIdDesc();
	}

	@Test
	void convertAndSave_DeveConverterDtoParaHistoricoCorretamente() {
		ChamadaPacienteDto dto = new ChamadaPacienteDto();
		dto.setNomePaciente("Fulano");
		dto.setClassificacao("Emergência");
		dto.setHorario(LocalDateTime.now());
		dto.setTipoServico(List.of("Cardiologia", "Ortopedia"));

		ArgumentCaptor<HistoricoChamados> captor = ArgumentCaptor.forClass(HistoricoChamados.class);

		service.convertAndSave(dto);

		verify(repository).save(captor.capture());

		HistoricoChamados saved = captor.getValue();

		assertNotNull(saved.getId());
		assertEquals(dto.getNomePaciente(), saved.getNomePaciente());
		assertEquals(dto.getClassificacao(), saved.getClassificacao());
		assertEquals(dto.getHorario(), saved.getHorario());
		assertEquals(dto.getTipoServico(), saved.getTiposServico());
	}

	@Test
	void convertAndSave_DeveGerarNovoIdQuandoSalvar() {
		ChamadaPacienteDto dto = new ChamadaPacienteDto();
		dto.setNomePaciente("Teste ID");

		ArgumentCaptor<HistoricoChamados> captor = ArgumentCaptor.forClass(HistoricoChamados.class);

		service.convertAndSave(dto);

		verify(repository).save(captor.capture());
		HistoricoChamados saved = captor.getValue();

		assertNotNull(saved.getId());
	}

	private HistoricoChamados createHistorico(String id, String nome) {
		HistoricoChamados historico = new HistoricoChamados();
		historico.setId(id);
		historico.setNomePaciente(nome);
		historico.setClassificacao("Urgente");
		historico.setHorario(LocalDateTime.now());
		historico.setTiposServico(List.of("Clínica Geral"));
		return historico;
	}
}
