package sigcaps.model.dto;

import lombok.Data;

@Data
public class ChangeCredentialsDto {
	private String currentUser;
	private String currentPassword;
	private String newUser;
	private String newPassword;
}
