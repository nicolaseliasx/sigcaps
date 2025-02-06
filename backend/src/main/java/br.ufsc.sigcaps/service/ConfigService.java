package br.ufsc.sigcaps.service;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.ufsc.sigcaps.model.document.ConfigDocument;
import br.ufsc.sigcaps.model.dto.ConfigDto;
import br.ufsc.sigcaps.repository.ConfigRepository;
import jakarta.annotation.PostConstruct;

@Service
public class ConfigService {
	private static final Long UNIQUE_ID = 1L;

	@Autowired
	private ConfigRepository repository;

	@PostConstruct
	private void loadDefaultConfigs() {
		Optional<ConfigDocument> config = this.load();
		String serverIp = String.format("http://%s:8081", this.getServerIp());
		if (config.isEmpty()) {
			ConfigDocument configDefault = new ConfigDocument();
			configDefault.setId(UNIQUE_ID);
			configDefault.setFontSize(2);
			configDefault.setVoiceVolume(1);
			configDefault.setServerAddrs(serverIp);

			this.save(configDefault);
		} else {
			ConfigDocument configLoad = config.get();
			configLoad.setServerAddrs(serverIp);

			this.save(configLoad);
		}
		System.out.println("IP do servidor: " + serverIp);
	}

	public void save(ConfigDocument newConfig) {
		newConfig.setId(UNIQUE_ID);
		repository.save(newConfig);
	}

	public Optional<ConfigDocument> load() {
		return repository.findById(String.valueOf(UNIQUE_ID));
	}

	private String getServerIp() {
		try {
			return InetAddress.getLocalHost().getHostAddress();
		} catch (UnknownHostException e) {
			e.printStackTrace();
			return "127.0.0.1";
		}
	}

	public ConfigDocument convertToDocument(ConfigDto dto) {
		ConfigDocument document = new ConfigDocument();
		document.setId(UNIQUE_ID);
		document.setFontSize(dto.getFontSize());
		document.setVoiceVolume(dto.getVoiceVolume());
		document.setServerAddrs(dto.getServerAddrs());
		document.setNomeInstalacao(dto.getNomeInstalacao());
		return document;
	}

	public ConfigDto convertToDto(ConfigDocument document) {
		ConfigDto dto = new ConfigDto();
		dto.setFontSize(document.getFontSize());
		dto.setVoiceVolume(document.getVoiceVolume());
		dto.setServerAddrs(document.getServerAddrs());
		return dto;
	}
}
