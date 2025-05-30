package sigcaps.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import sigcaps.repository.ConfigRepository;
import sigcaps.repository.model.Config;
import sigcaps.service.model.ConfigDto;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConfigServiceTest {

	@Mock
	private ConfigRepository configRepository;

	@Mock
	private MessagingService messagingService;

	@Mock
	private ModelMapper modelMapper;

	@InjectMocks
	private ConfigService configService;

	private static final String UNIQUE_ID = "sigcaps-primary-key-config";

	@Test
	void onApplicationReady_CreatesDefaultConfigWhenNotExists() {
		when(configRepository.findById(UNIQUE_ID)).thenReturn(Optional.empty());

		Config mappedEntity = new Config();
		when(modelMapper.map(any(ConfigDto.class), eq(Config.class))).thenReturn(mappedEntity);

		ArgumentCaptor<Config> configCaptor = ArgumentCaptor.forClass(Config.class);

		configService.onApplicationReady();

		verify(configRepository).save(configCaptor.capture());
		verify(messagingService).convertAndSend(eq("/topic/config/load"), any(ConfigDto.class));
	}

	@Test
	void onApplicationReady_DoesNothingWhenConfigExists() {
		Config existingEntity = new Config();
		existingEntity.setId(UNIQUE_ID);

		ConfigDto existingDto = new ConfigDto();
		when(configRepository.findById(UNIQUE_ID))
				.thenReturn(Optional.of(existingEntity));
		when(modelMapper.map(existingEntity, ConfigDto.class))
				.thenReturn(existingDto);

		configService.onApplicationReady();

		verify(configRepository, never()).save(any());
		verify(messagingService, never()).convertAndSend(any(), any());
	}

	@Test
	void save_MapsDtoToEntityAndSaves() {
		ConfigDto dto = new ConfigDto();
		dto.setFontSize(3);
		dto.setVoiceVolume(80);
		dto.setInstallationName("Test");

		Config mappedEntity = new Config();
		when(modelMapper.map(dto, Config.class)).thenReturn(mappedEntity);

		configService.save(dto);

		verify(modelMapper).map(dto, Config.class);
		assertEquals(UNIQUE_ID, mappedEntity.getId());
		verify(configRepository).save(mappedEntity);
		verify(messagingService).convertAndSend("/topic/config/load", dto);
	}

	@Test
	void load_ReturnsConfigDtoWhenExists() {
		Config entity = new Config();
		entity.setFontSize(3);
		entity.setVoiceVolume(80);
		entity.setInstallationName("Test");

		ConfigDto expectedDto = new ConfigDto();
		expectedDto.setFontSize(3);
		expectedDto.setVoiceVolume(80);
		expectedDto.setInstallationName("Test");

		when(configRepository.findById(UNIQUE_ID)).thenReturn(Optional.of(entity));
		when(modelMapper.map(entity, ConfigDto.class)).thenReturn(expectedDto);

		Optional<ConfigDto> result = configService.load();

		assertTrue(result.isPresent());
		assertEquals(expectedDto, result.get());
		verify(modelMapper).map(entity, ConfigDto.class);
	}

	@Test
	void load_ReturnsEmptyWhenConfigNotExists() {
		when(configRepository.findById(UNIQUE_ID)).thenReturn(Optional.empty());

		Optional<ConfigDto> result = configService.load();

		assertTrue(result.isEmpty());
		verify(modelMapper, never()).map(any(), eq(ConfigDto.class));
	}
}
