package sigcaps.api.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import sigcaps.service.ChamadaPacienteService;
import sigcaps.service.model.ChamadaPacienteDto;
import sigcaps.service.model.HistoricoChamadosDto;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ChamadaPacientesWebSocketControllerTest {

	@Mock
	private ChamadaPacienteService chamadaPacienteService;

	@InjectMocks
	private ChamadaPacientesWebSocketController controller;

	@Test
	void handleChamadaPaciente_DeveChamarServicoComDadosCompletos() {
		HistoricoChamadosDto historico = new HistoricoChamadosDto();
		historico.setNomePaciente("Maria Oliveira");
		historico.setClassificacao("Urgente");
		historico.setHorario(LocalDateTime.of(2024, 3, 14, 9, 15));
		historico.setTipoServico(List.of("Raio-X"));

		ChamadaPacienteDto input = new ChamadaPacienteDto();
		input.setNomePaciente("João da Silva");
		input.setClassificacao("Prioritário");
		input.setHorario(LocalDateTime.of(2024, 3, 15, 14, 30));
		input.setTipoServico(List.of("Consulta", "Exames"));
		input.setHistorico(List.of(historico));

		controller.handleChamadaPaciente(input);

		verify(chamadaPacienteService).chamarPaciente(
				argThat(dto ->
						dto.getNomePaciente().equals("João da Silva") &&
								dto.getClassificacao().equals("Prioritário") &&
								dto.getTipoServico().size() == 2 &&
								dto.getHistorico().get(0).getNomePaciente().equals("Maria Oliveira") &&
								dto.getHistorico().get(0).getTipoServico().contains("Raio-X")
				)
		);
	}
}
