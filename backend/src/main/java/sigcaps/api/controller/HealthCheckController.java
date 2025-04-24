package sigcaps.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthCheckController {
	@GetMapping("/status")
	public ResponseEntity<Void> status() {
		return ResponseEntity.ok().build();
	}
}
