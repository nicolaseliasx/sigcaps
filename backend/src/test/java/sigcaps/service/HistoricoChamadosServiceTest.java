package sigcaps.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import sigcaps.repository.HistoricoChamadosRepository;
import sigcaps.repository.model.HistoricoChamados;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
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

		service.save(historico);

		verify(repository).save(historico);
	}

	@Test
	void getUltimos10Registros_DeveRetornarListaDoRepositorio() {
		List<HistoricoChamados> mockList = Collections.nCopies(10, new HistoricoChamados());
		when(repository.findTop10ByOrderByIdDesc()).thenReturn(mockList);

		List<HistoricoChamados> result = service.getUltimos10Registros();

		assertEquals(10, result.size());
		verify(repository).findTop10ByOrderByIdDesc();
	}
}
