package app.vercel.leonanthomaz.saturno.dto;

import app.vercel.leonanthomaz.saturno.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {
    private String name;
    private String email;
    private String password;
    private UserRole role;
}
