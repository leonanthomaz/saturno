package app.vercel.leonanthomaz.saturno.controller;

import app.vercel.leonanthomaz.saturno.service.TokenService;
import app.vercel.leonanthomaz.saturno.model.User;
import app.vercel.leonanthomaz.saturno.dto.LoginDTO;
import app.vercel.leonanthomaz.saturno.dto.RegisterDTO;
import app.vercel.leonanthomaz.saturno.dto.TokenDTO;
import app.vercel.leonanthomaz.saturno.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("auth")
@Log4j2
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid LoginDTO data){
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getPassword());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.createToken((User) auth.getPrincipal());
        return ResponseEntity.ok(new TokenDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data){
        if(this.userRepository.findByEmail(data.getEmail()) != null) return ResponseEntity.badRequest().build();
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.getPassword());
        User newUser = new User(data.getName(), data.getEmail(), encryptedPassword, data.getRole());
        this.userRepository.save(newUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user")
    public ResponseEntity getUserDetails(@RequestHeader("Authorization") String authorizationHeader) {
        // Extrair o token do cabeçalho de autorização
        String token = authorizationHeader.replace("Bearer ", "");

        // Verificar se o token é válido e obter os detalhes do usuário
        UserDetails userDetails = tokenService.getUserDetailsFromToken(token);
        if (userDetails instanceof User) {
            // Se os detalhes do usuário forem recuperados com sucesso, retorne-os na resposta
            return ResponseEntity.ok(userDetails);
        } else {
            // Se não for possível recuperar os detalhes do usuário, retorne um erro ou uma resposta adequada
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido!");
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getActiveUsers() {
        // Implemente a lógica para obter a lista de usuários ativos no sistema
        List<User> activeUsers = userRepository.findAll();
        return ResponseEntity.ok(activeUsers);
    }
}
