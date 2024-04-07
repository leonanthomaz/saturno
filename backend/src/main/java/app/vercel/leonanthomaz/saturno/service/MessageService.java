package app.vercel.leonanthomaz.saturno.service;

import app.vercel.leonanthomaz.saturno.model.Message;
import app.vercel.leonanthomaz.saturno.model.User;
import app.vercel.leonanthomaz.saturno.repository.MessageRepository;
import app.vercel.leonanthomaz.saturno.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public List<Message> getMessagesByUserId(Long userId) {
        return messageRepository.findByUserId(userId);
    }
}
