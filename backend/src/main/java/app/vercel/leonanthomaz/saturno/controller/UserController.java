package app.vercel.leonanthomaz.saturno.controller;

import app.vercel.leonanthomaz.saturno.config.auth.SecurityFilter;
import app.vercel.leonanthomaz.saturno.model.User;
import app.vercel.leonanthomaz.saturno.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{email}")
    public ResponseEntity<User> findUserWithEmail(@PathVariable String email) {
        User user = (User) userRepository.findByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("all")
    public ResponseEntity<List<User>> listAll(){
        return ResponseEntity.status(HttpStatus.OK).body(userRepository.findAll());
    }
}
