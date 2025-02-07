package sigcaps.model.document;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "historico")
public class HistoricoChamadosDocument {
	@Id
	private String id;
	private String nomePaciente;
	private String classificacao;
	private List<String> tipoServico;
	private LocalDateTime horario;
}
