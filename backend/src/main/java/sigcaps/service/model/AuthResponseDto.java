package sigcaps.service.model;

import lombok.Data;

@Data
public class AuthResponseDto {
	public String token;
	public String refreshToken;
}
