package sigcaps.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import sigcaps.model.document.User;
import sigcaps.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

	@Mock
	private UserRepository userRepository;

	@Mock
	private PasswordEncoder passwordEncoder;

	@InjectMocks
	private UserService userService;

	@Test
	void validateSuperUser_withValidCredentials_returnsTrue() {
		User mockUser = new User();
		mockUser.setUsername("admin");
		mockUser.setPassword("encodedPassword");

		when(userRepository.findByUsername("admin")).thenReturn(Optional.of(mockUser));
		when(passwordEncoder.matches("admin123", "encodedPassword")).thenReturn(true);

		boolean result = userService.validateSuperUser("admin", "admin123");

		assertTrue(result);
		verify(userRepository).findByUsername("admin");
		verify(passwordEncoder).matches("admin123", "encodedPassword");
	}

	@Test
	void validateSuperUser_withInvalidUsername_returnsFalse() {
		when(userRepository.findByUsername("invaliduser")).thenReturn(Optional.empty());

		boolean result = userService.validateSuperUser("invaliduser", "admin123");

		assertFalse(result);
		verify(userRepository).findByUsername("invaliduser");
		verifyNoInteractions(passwordEncoder);
	}

	@Test
	void validateSuperUser_withInvalidPassword_returnsFalse() {
		User mockUser = new User();
		mockUser.setUsername("admin");
		mockUser.setPassword("encodedPassword");

		when(userRepository.findByUsername("admin")).thenReturn(Optional.of(mockUser));
		when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

		boolean result = userService.validateSuperUser("admin", "wrongpassword");

		assertFalse(result);
		verify(passwordEncoder).matches("wrongpassword", "encodedPassword");
	}

	@Test
	void validateSuperUser_withInvalidCredentials_returnsFalse() {
		when(userRepository.findByUsername("invaliduser")).thenReturn(Optional.empty());

		boolean result = userService.validateSuperUser("invaliduser", "wrongpassword");

		assertFalse(result);
		verify(userRepository).findByUsername("invaliduser");
		verifyNoInteractions(passwordEncoder);
	}
}
