package sigcaps.repository.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "config")
public class Config {
	@Id
	private String id;
	private String installationName;
	private Integer fontSize;
	private Integer voiceVolume;
}
