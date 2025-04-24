package sigcaps.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import sigcaps.repository.ConfigRepository;
import sigcaps.repository.model.Config;

@Service
public class ConfigService {
	private static final String UNIQUE_ID = "sigcaps-primary-key-config";

	@Autowired
	private ConfigRepository repository;

	@Autowired
	private MessagingService messagingService;

	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		Optional<Config> config = this.load();
		if (config.isEmpty()) {
			Config configDefault = new Config();
			configDefault.setId(UNIQUE_ID);
			configDefault.setFontSize(2);
			configDefault.setVoiceVolume(100);
			configDefault.setInstallationName("");
			this.save(configDefault);
		}
	}

	public void save(Config newConfig) {
		newConfig.setId(UNIQUE_ID);
		repository.save(newConfig);
		messagingService.convertAndSend("/topic/config/load", newConfig);
	}

	public Optional<Config> load() {
		return repository.findById(UNIQUE_ID);
	}
}
