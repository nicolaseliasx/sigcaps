package sigcaps;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class SpringBootServerStarterTest {

	@Test
	void contextLoads(ApplicationContext context) {
		assertNotNull(context, "O contexto da aplicação deve ser carregado");
	}

	@Test
	void main_DeveIniciarAplicacao() {
		SpringBootServerStarter.main(new String[]{});
	}
}
