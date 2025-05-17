package sigcaps.service;

import java.util.Optional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import sigcaps.repository.ConfigRepository;
import sigcaps.repository.model.Config;
import sigcaps.service.model.ConfigDto;

@Service
public class ConfigService {
	private static final String UNIQUE_ID = "sigcaps-primary-key-config";

	@Autowired
	private ConfigRepository repository;

	@Autowired
	private MessagingService messagingService;

	@Autowired
	private ModelMapper modelMapper;

	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		Optional<ConfigDto> configOptional = this.load();
		if (configOptional.isEmpty()) {
			ConfigDto configDefault = new ConfigDto();
			configDefault.setId(UNIQUE_ID);
			configDefault.setFontSize(2);
			configDefault.setVoiceVolume(100);
			configDefault.setInstallationName("");
			this.save(configDefault);
		}
	}

	public void save(ConfigDto newConfig) {
		Config config = modelMapper.map(newConfig, Config.class);
		config.setId(UNIQUE_ID);
		repository.save(config);
		messagingService.convertAndSend("/topic/config/load", newConfig);
	}

	public Optional<ConfigDto> load() {
		Optional<Config> optionalConfig = repository.findById(UNIQUE_ID);
		return optionalConfig.map(config -> modelMapper.map(config, ConfigDto.class));
	}
}
