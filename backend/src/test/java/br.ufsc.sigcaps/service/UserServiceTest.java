package br.ufsc.sigcaps.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class UserServiceTest {
	private final UserService userService = new UserService();

	@Test
	void validateSuperUser_withValidCredentials_returnsTrue() {
		String validUsername = "superuser";
		String validPassword = "password123";

		boolean result = userService.validateSuperUser(validUsername, validPassword);

		assertTrue(result, "Expected superuser credentials to be valid");
	}

	@Test
	void validateSuperUser_withInvalidUsername_returnsFalse() {
		String invalidUsername = "invaliduser";
		String validPassword = "password123";

		boolean result = userService.validateSuperUser(invalidUsername, validPassword);

		assertFalse(result, "Expected invalid username to return false");
	}

	@Test
	void validateSuperUser_withInvalidPassword_returnsFalse() {
		String validUsername = "superuser";
		String invalidPassword = "wrongpassword";

		boolean result = userService.validateSuperUser(validUsername, invalidPassword);

		assertFalse(result, "Expected invalid password to return false");
	}

	@Test
	void validateSuperUser_withInvalidCredentials_returnsFalse() {
		String invalidUsername = "invaliduser";
		String invalidPassword = "wrongpassword";

		boolean result = userService.validateSuperUser(invalidUsername, invalidPassword);

		assertFalse(result, "Expected invalid credentials to return false");
	}
}
