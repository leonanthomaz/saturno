package app.vercel.leonanthomaz.saturno.service;

import app.vercel.leonanthomaz.saturno.model.User;
import app.vercel.leonanthomaz.saturno.repository.UserRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
@Log4j2
public class TokenService {

    private String secret = "MinhaPalavra";
    @Autowired
    private UserRepository userRepository; // Injete o repositório do usuário aqui.

    public String createToken(User user){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("login")
                    .withSubject(user.getEmail())
                    .withExpiresAt(genExpirationDate())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            log.error("Erro na geração do Token para o usuário: {}", exception.getMessage());
            throw new RuntimeException("Erro na geração do Token para o usuário.", exception);
        }
    }

    public String validateToken(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("login")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            log.error("Erro na validação do Token: {}", exception.getMessage());
            return "";
        }
    }

    public User getUserDetailsFromToken(String token) {
        try {
            String email = JWT.require(Algorithm.HMAC256(secret))
                    .withIssuer("login")
                    .build()
                    .verify(token)
                    .getSubject();
            return (User) userRepository.findByEmail(email);
        } catch (JWTVerificationException exception) {
            log.error("Erro na validação do Token: {}", exception.getMessage());
            return null;
        }
    }

    private Instant genExpirationDate(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}