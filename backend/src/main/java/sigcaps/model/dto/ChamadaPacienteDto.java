package sigcaps.model.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class ChamadaPacienteDto {
	private String nomePaciente;
	private String classificacao;
	private LocalDateTime horario;
	private List<String> tipoServico;

	private List<HistoricoChamadosDto> historico;
}
