package sigcaps.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import sigcaps.model.document.User;
import sigcaps.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostConstruct
	public void createInitialAdmin() {
		if (!userRepository.existsByUsername("admin")) {
			User admin = new User();
			admin.setUsername("admin");
			admin.setPassword(passwordEncoder.encode("admin123"));
			userRepository.save(admin);
		}
	}

	public boolean validateSuperUser(String username, String password) {
		Optional<User> user = userRepository.findByUsername(username);
		return user.isPresent() && passwordEncoder.matches(password, user.get().getPassword());
	}
}
