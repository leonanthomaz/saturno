package app.vercel.leonanthomaz.saturno.config.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/chat/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
        registry.addMapping("/auth/**") // Permitir apenas em URLs sob o caminho /auth/**
                .allowedOriginPatterns("*") // Permitir de todas as origens
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Permitir todos os métodos
                .allowCredentials(true); // Permitir credenciais
        registry.addMapping("/auth/users/**") // Permitir apenas em URLs sob o caminho /auth/**
                .allowedOriginPatterns("*") // Permitir de todas as origens
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Permitir todos os métodos
                .allowCredentials(true); // Permitir credenciais

        registry.addMapping("/topic/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
        registry.addMapping("/websocket/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
        registry.addMapping("/socket.io/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);

        registry.addMapping("/messages/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
        registry.addMapping("/ws/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
}