package sigcaps.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import sigcaps.repository.model.HistoricoChamados;
import sigcaps.service.model.ChamadaPacienteDto;
import sigcaps.service.model.HistoricoChamadosDto;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChamadaPacienteServiceTest {

	@Mock
	private HistoricoChamadosService historicoService;

	@Mock
	private MessagingService messagingService;

	@Mock
	private ModelMapper modelMapper;

	@Mock
	private Clock clock;

	@InjectMocks
	private ChamadaPacienteService chamadaService;

	@Test
	void chamarPaciente_DeveProcessarChamadaCompleta() {
		LocalDateTime fixedTime = LocalDateTime.of(2024, 3, 15, 14, 30);
		ChamadaPacienteDto dto = new ChamadaPacienteDto();
		HistoricoChamados historico = new HistoricoChamados();
		HistoricoChamadosDto historicoDto = new HistoricoChamadosDto();

		when(clock.instant()).thenReturn(fixedTime.atZone(ZoneId.systemDefault()).toInstant());
		when(clock.getZone()).thenReturn(ZoneId.systemDefault());
		when(modelMapper.map(dto, HistoricoChamados.class)).thenReturn(historico);
		when(modelMapper.map(historico, HistoricoChamadosDto.class)).thenReturn(historicoDto);
		when(historicoService.getUltimos10Registros()).thenReturn(Collections.singletonList(historico));

		chamadaService.chamarPaciente(dto);

		assertEquals(fixedTime, dto.getHorario());
		verify(historicoService).save(historico);
		verify(modelMapper).map(dto, HistoricoChamados.class);
		verify(modelMapper).map(historico, HistoricoChamadosDto.class);
		verify(messagingService).convertAndSend("/topic/chamadaPaciente", dto);
	}

	@Test
	void saveHistorico_DeveConverterESalvarCorretamente() {
		LocalDateTime fixedTime = LocalDateTime.of(2024, 3, 15, 14, 30);
		when(clock.instant()).thenReturn(fixedTime.atZone(ZoneId.systemDefault()).toInstant());
		when(clock.getZone()).thenReturn(ZoneId.systemDefault());

		ChamadaPacienteDto dto = new ChamadaPacienteDto();
		HistoricoChamados historico = new HistoricoChamados();

		when(modelMapper.map(dto, HistoricoChamados.class)).thenReturn(historico);

		chamadaService.chamarPaciente(dto);

		verify(modelMapper).map(dto, HistoricoChamados.class);
		verify(historicoService).save(historico);
	}
}
