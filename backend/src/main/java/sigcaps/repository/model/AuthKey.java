package sigcaps.repository.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "auth_keys")
public class AuthKey {
	@Id
	private String id;
	private String accessKey;
}
