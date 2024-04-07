package app.vercel.leonanthomaz.saturno.config.web;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 *
 * <p>afterConnectionEstablished: Este método é chamado quando uma nova conexão WebSocket é estabelecida. No exemplo fornecido, ele adiciona a sessão WebSocket recém-conectada à lista connectedUsers.<p/>
 *
 * <p>handleTextMessage: Este método é chamado quando uma mensagem de texto é recebida de um cliente WebSocket. No exemplo fornecido, ele processa a mensagem recebida e a reenvia para todos os usuários conectados na lista connectedUsers.<p/>
 *
 * <p>handleTransportError: Este método é chamado quando ocorre um erro de transporte durante a conexão WebSocket, como um erro de E/S. No exemplo fornecido, ele fecha a conexão do usuário afetado.<p/>
 *
 * <p>afterConnectionClosed: Este método é chamado quando uma conexão WebSocket é fechada. No exemplo fornecido, ele remove a sessão WebSocket da lista connectedUsers.<p/>
 */

@Log4j2
@Component
public class WebSocketHandler extends TextWebSocketHandler {
    // Lista de sessões WebSocket conectadas
    private List<WebSocketSession> connectedUsers = new CopyOnWriteArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Adicionar o usuário à lista de usuários conectados
        // Exemplo:
        connectedUsers.add(session);
        log.info("SESSAO: {}", session);
    }

    // No WebSocketHandler
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Processar a mensagem recebida
        String receivedMessage = message.getPayload();
        log.info("MENSAGEM: {}", receivedMessage);

        // Enviar a mensagem recebida apenas para o usuário destinatário
        session.sendMessage(new TextMessage(receivedMessage));
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        // Tratar o erro de transporte
        // Exemplo: fechar a conexão
        session.close();
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Remover o usuário da lista de usuários conectados
        connectedUsers.remove(session);
    }
}