package sigcaps.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import sigcaps.repository.model.HistoricoChamados;
import sigcaps.service.model.ChamadaPacienteDto;
import sigcaps.service.model.HistoricoChamadosDto;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChamadaPacienteServiceTest {

	@Mock
	private HistoricoChamadosService historicoService;

	@Mock
	private MessagingService messagingService;

	@Mock
	private Clock clock;

	@InjectMocks
	private ChamadaPacienteService chamadaService;

	@Test
	void chamarPaciente_DeveProcessarChamadaCompleta() {
		LocalDateTime fixedTime = LocalDateTime.of(2024, 3, 15, 14, 30);
		ChamadaPacienteDto dto = new ChamadaPacienteDto();
		dto.setNomePaciente("Paciente Teste");
		dto.setClassificacao("URGENTE");
		dto.setTipoServico(List.of("CLÍNICA GERAL"));

		HistoricoChamados historicoSalvo = new HistoricoChamados();
		historicoSalvo.setNomePaciente(dto.getNomePaciente());
		historicoSalvo.setClassificacao(dto.getClassificacao());
		historicoSalvo.setTiposServico(dto.getTipoServico());
		historicoSalvo.setHorario(fixedTime);

		HistoricoChamadosDto historicoDto = new HistoricoChamadosDto();
		historicoDto.setNomePaciente(historicoSalvo.getNomePaciente());
		historicoDto.setClassificacao(historicoSalvo.getClassificacao());
		historicoDto.setTipoServico(historicoSalvo.getTiposServico());
		historicoDto.setHorario(historicoSalvo.getHorario());

		when(clock.instant()).thenReturn(fixedTime.atZone(ZoneId.systemDefault()).toInstant());
		when(clock.getZone()).thenReturn(ZoneId.systemDefault());

		when(historicoService.getUltimos10Registros()).thenReturn(List.of(historicoSalvo));

		chamadaService.chamarPaciente(dto);

		assertEquals(fixedTime, dto.getHorario());

		verify(historicoService).convertAndSave(dto);

		verify(historicoService).getUltimos10Registros();

		assertEquals(1, dto.getHistorico().size());
		HistoricoChamadosDto dtoHistorico = dto.getHistorico().get(0);
		assertEquals(historicoDto.getNomePaciente(), dtoHistorico.getNomePaciente());
		assertEquals(historicoDto.getClassificacao(), dtoHistorico.getClassificacao());
		assertEquals(historicoDto.getTipoServico(), dtoHistorico.getTipoServico());
		assertEquals(historicoDto.getHorario(), dtoHistorico.getHorario());

		verify(messagingService).convertAndSend("/topic/chamadaPaciente", dto);
	}

	@Test
	void chamarPaciente_DeveLidarComListaVazia() {
		LocalDateTime fixedTime = LocalDateTime.of(2024, 3, 15, 14, 30);
		ChamadaPacienteDto dto = new ChamadaPacienteDto();

		when(clock.instant()).thenReturn(fixedTime.atZone(ZoneId.systemDefault()).toInstant());
		when(clock.getZone()).thenReturn(ZoneId.systemDefault());

		when(historicoService.getUltimos10Registros()).thenReturn(Collections.emptyList());

		chamadaService.chamarPaciente(dto);

		assertEquals(fixedTime, dto.getHorario());
		verify(historicoService).convertAndSave(dto);
		verify(historicoService).getUltimos10Registros();
		assertEquals(0, dto.getHistorico().size());
		verify(messagingService).convertAndSend("/topic/chamadaPaciente", dto);
	}
}
