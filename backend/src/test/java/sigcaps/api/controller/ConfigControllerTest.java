package sigcaps.api.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import sigcaps.service.ConfigService;
import sigcaps.service.model.ConfigDto;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ConfigControllerTest {

	@Mock
	private ConfigService configService;

	@InjectMocks
	private ConfigController configController;

	@Test
	void carregarConfiguracao_QuandoConfigExistir_DeveRetornarOKComConfiguracao() {
		ConfigDto mockConfig = new ConfigDto();
		mockConfig.setInstallationName("Clínica Saúde Total");
		when(configService.load()).thenReturn(Optional.of(mockConfig));

		ResponseEntity<ConfigDto> response = configController.loadConfig();

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("Clínica Saúde Total", response.getBody().getInstallationName());
	}

	@Test
	void carregarConfiguracao_QuandoConfigNaoExistir_DeveRetornarErroInterno() {
		when(configService.load()).thenReturn(Optional.empty());

		ResponseEntity<ConfigDto> response = configController.loadConfig();

		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
		assertNull(response.getBody());
	}

	@Test
	void salvarConfiguracao_QuandoDadosValidos_DeveSalvarERetornarConfigAtualizada() {
		ConfigDto input = new ConfigDto();
		input.setFontSize(18);

		ResponseEntity<ConfigDto> response = configController.saveConfig(input);

		verify(configService).save(input);
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(18, response.getBody().getFontSize());
	}

	@Test
	void salvarConfiguracao_QuandoFalhaNoServico_DeveRetornarErroInterno() {
		ConfigDto input = new ConfigDto();
		doThrow(new RuntimeException("Erro no banco")).when(configService).save(input);

		ResponseEntity<ConfigDto> response = configController.saveConfig(input);

		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
		assertNull(response.getBody());
	}
}
