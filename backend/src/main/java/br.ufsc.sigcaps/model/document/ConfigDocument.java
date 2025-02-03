package br.ufsc.sigcaps.model.document;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "config")
public class ConfigDocument {
	@Id
	private String id;
	private Integer fontSize;
	private Integer voiceVolume;
	private String serverAddrs;
	private List<String> tokens;
}
