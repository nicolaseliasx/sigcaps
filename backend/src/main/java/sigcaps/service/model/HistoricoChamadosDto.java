package sigcaps.service.model;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class HistoricoChamadosDto {
	private String nomePaciente;
	private String classificacao;
	private LocalDateTime horario;
	private List<String> tipoServico;
}
