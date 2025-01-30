package br.ufsc.sigcaps.model.dto;

import lombok.Data;

@Data
public class ConfigDto {
	private Integer fontSize;
	private Integer voiceVolume;
	private String serverAddrs;

	private String clientAddrs;
	private String token;
}
