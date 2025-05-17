package sigcaps.service.model;

import lombok.Data;

@Data
public class ConfigDto {
	private String id;
	private String installationName;
	private Integer fontSize;
	private Integer voiceVolume;
}
