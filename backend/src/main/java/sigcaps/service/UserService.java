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

	private static final String UNIQUE_ID = "1";

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostConstruct
	public void createInitialAdmin() {
		Optional<User> admin = this.userRepository.findById(UNIQUE_ID);
		if (admin.isEmpty()) {
			User initialAdmin = new User();
			initialAdmin.setId(UNIQUE_ID);
			initialAdmin.setUsername("admin");
			initialAdmin.setPassword(passwordEncoder.encode("admin123"));
			userRepository.save(initialAdmin);
		}
	}

	public boolean validateSuperUser(String username, String password) {
		Optional<User> user = userRepository.findByUsername(username);
		return user.isPresent() && passwordEncoder.matches(password, user.get().getPassword());
	}

	public void changeSuperUser(String newUsername, String newPassword) {
		Optional<User> admin = this.userRepository.findById(UNIQUE_ID);
		if (admin.isPresent()) {
			User update = admin.get();
			update.setUsername(newUsername);
			update.setPassword(passwordEncoder.encode(newPassword));
			userRepository.save(update);
		}
	}
}
