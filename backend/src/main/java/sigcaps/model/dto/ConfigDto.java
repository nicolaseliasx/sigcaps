package sigcaps.model.dto;

import lombok.Data;

@Data
public class ConfigDto {
	private String nomeInstalacao;
	private Integer fontSize;
	private Integer voiceVolume;
	private String serverAddrs;
}
