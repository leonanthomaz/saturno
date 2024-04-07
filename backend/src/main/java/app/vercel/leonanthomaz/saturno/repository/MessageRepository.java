package app.vercel.leonanthomaz.saturno.repository;

import app.vercel.leonanthomaz.saturno.model.Message;
import app.vercel.leonanthomaz.saturno.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByUserId(Long userId);
}