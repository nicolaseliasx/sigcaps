package sigcaps.service;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import sigcaps.model.document.Config;
import sigcaps.model.dto.ConfigDto;
import sigcaps.repository.ConfigRepository;

@Service
public class ConfigService {
	private static final String UNIQUE_ID = "1";

	@Autowired
	private ConfigRepository repository;

	@PostConstruct
	private void loadDefaultConfigs() {
		Optional<Config> config = this.load();
		String serverIp = String.format("http://%s:8081", this.getServerIp());
		if (config.isEmpty()) {
			Config configDefault = new Config();
			configDefault.setId(UNIQUE_ID);
			configDefault.setFontSize(2);
			configDefault.setVoiceVolume(100);
			configDefault.setServerAddrs(serverIp);

			this.save(configDefault);
		} else {
			Config configLoad = config.get();
			configLoad.setServerAddrs(serverIp);

			this.save(configLoad);
		}
		System.out.println("IP do servidor: " + serverIp);
	}

	public void save(Config newConfig) {
		newConfig.setId(UNIQUE_ID);
		repository.save(newConfig);
	}

	public Optional<Config> load() {
		return repository.findById(UNIQUE_ID);
	}

	private String getServerIp() {
		try {
			return InetAddress.getLocalHost().getHostAddress();
		} catch (UnknownHostException e) {
			e.printStackTrace();
			return "127.0.0.1";
		}
	}

	public Config convertToDocument(ConfigDto dto) {
		Config document = new Config();
		document.setId(UNIQUE_ID);
		document.setFontSize(dto.getFontSize());
		document.setVoiceVolume(dto.getVoiceVolume());
		document.setServerAddrs(dto.getServerAddrs());
		document.setNomeInstalacao(dto.getNomeInstalacao());
		return document;
	}

	public ConfigDto convertToDto(Config document) {
		ConfigDto dto = new ConfigDto();
		dto.setNomeInstalacao(document.getNomeInstalacao());
		dto.setFontSize(document.getFontSize());
		dto.setVoiceVolume(document.getVoiceVolume());
		dto.setServerAddrs(document.getServerAddrs());
		return dto;
	}
}
