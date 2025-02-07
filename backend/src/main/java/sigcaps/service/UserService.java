package sigcaps.service;

import org.springframework.stereotype.Service;

@Service
public class UserService {
	// TODO(@NICOLAS): MOVER SUPER USER PRO BANCO DE DADOS
	private static final String SUPER_USER = "superuser";
	private static final String SUPER_PASSWORD = "password123";

	public boolean validateSuperUser(String username, String password) {
		return SUPER_USER.equals(username) && SUPER_PASSWORD.equals(password);
	}
}
