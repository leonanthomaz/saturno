package app.vercel.leonanthomaz.saturno.controller;

import app.vercel.leonanthomaz.saturno.model.Message;
import app.vercel.leonanthomaz.saturno.service.MessageService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Log4j2
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private MessageService messageService;

    @MessageMapping("message")
    public void receiveMessage(Message message){
        simpMessagingTemplate.convertAndSend("/topic/chat", message); // Emitir a nova mensagem para o tópico "/topic/chat"
    }

    @GetMapping("/messages")
    public List<Message> getAllMessages() {
        List<Message> messages = messageService.getAllMessages();
        log.info("Retrieved all messages: {}", messages);
        return messages;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/messages/{userId}")
    public ResponseEntity<List<Message>> getMessagesByUserId(@PathVariable Long userId) {
        List<Message> messages = messageService.getMessagesByUserId(userId);
        if (messages != null) {
            log.info("Retrieved messages for user with ID {}: {}", userId, messages);
            return ResponseEntity.ok(messages);
        } else {
            log.info("No messages found for user with ID: {}", userId);
            return ResponseEntity.notFound().build();
        }
    }
}
