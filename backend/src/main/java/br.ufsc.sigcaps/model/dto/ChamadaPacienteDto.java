package br.ufsc.sigcaps.model.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class ChamadaPacienteDto {
	private String nomePaciente;
	private String classificacao;
	private LocalDateTime horario;
	private List<String> tipoServico;

	// Melhor separar em dois objs input e output? ess parametor no input sempre sera null
	private List<HistoricoChamadosDto> historico;
}
