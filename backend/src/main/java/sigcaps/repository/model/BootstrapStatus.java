package sigcaps.repository.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "bootstrap_status")
public class BootstrapStatus {
	@Id
	private String id;
	private boolean used;
}
