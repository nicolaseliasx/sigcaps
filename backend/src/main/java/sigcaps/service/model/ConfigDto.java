package sigcaps.service.model;

import lombok.Data;

@Data
public class ConfigDto {
	private String installationName;
	private Integer fontSize;
	private Integer voiceVolume;
	private String serverAddrs;
}
