package sigcaps.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class MessagingServiceTest {

	@Mock
	private SimpMessagingTemplate messagingTemplate;

	@InjectMocks
	private MessagingService messagingService;

	@Test
	void convertAndSend_DeveEnviarMensagemParaOTopico() {
		Object payload = new Object();
		String topic = "/test/topic";

		messagingService.convertAndSend(topic, payload);

		verify(messagingTemplate).convertAndSend(topic, payload);
	}
}
