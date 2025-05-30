package sigcaps.api.controller;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class HealthCheckControllerTest {

	private final MockMvc mockMvc = MockMvcBuilders
			.standaloneSetup(new HealthCheckController())
			.build();

	@Test
	void verificarStatus_DeveRetornarOk() throws Exception {
		mockMvc.perform(get("/api/health/status"))
				.andExpect(status().isOk());
	}
}
