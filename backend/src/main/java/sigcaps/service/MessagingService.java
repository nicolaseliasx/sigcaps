package sigcaps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessagingService {

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	public void convertAndSend(String topic, Object object) {
		messagingTemplate.convertAndSend(topic, object);
	}
}
