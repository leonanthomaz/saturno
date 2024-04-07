package app.vercel.leonanthomaz.saturno.config.db;

import app.vercel.leonanthomaz.saturno.enums.UserRole;
import app.vercel.leonanthomaz.saturno.model.User;
import app.vercel.leonanthomaz.saturno.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class Database {

    @Bean
    public CommandLineRunner dataInitializer(UserRepository userRepository) {
        return args -> {
            // Criação de dois funcionários
            User funcionario1 = User.builder()
                    .name("Leonan")
                    .email("leonan.thomaz@gmail.com")
                    .password(passwordEncoder().encode("123"))
                    .role(UserRole.ADMIN)
                    .build();

            User funcionario2 = User.builder()
                    .name("Thaiane")
                    .email("thaiane@gmail.com")
                    .password(passwordEncoder().encode("456"))
                    .role(UserRole.USER)
                    .build();

            // Salvando os funcionários no banco de dados
            userRepository.save(funcionario1);
            userRepository.save(funcionario2);
        };
    }

    public static PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
