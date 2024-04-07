import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { Container, TextField, Button, Card, CardHeader, Avatar, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '../../contexts/AuthContext';

const StyledContainer = styled(Container)({
  padding: '50px 100px',
  zIndex: 999,
  position: 'absolute',
});

const StyledCard = styled(Card)({
  display: 'flex',
  height: 'calc(100vh - 100px)',
});

const LeftContainer = styled('div')({
  flex: '0 0 30%',
  borderRight: 'solid #d0d0d0 1px',
  padding: '20px',
  overflowY: 'auto',
});

const RightContainer = styled('div')({
  flex: 1,
  padding: '20px',
  color: '#444',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '100%',
  overflowY: 'auto',
});

const MessageList = styled(List)({
  overflowY: 'auto',
  flexGrow: 1,
  background: '#f1f1f1',
});

const MessageBox = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  marginBottom: '10px',
});

const SenderBubble = styled('div')({
  backgroundColor: '#DCF8C6',
  color: '#000',
  padding: '8px 12px',
  borderRadius: '10px',
  maxWidth: '70%',
  wordWrap: 'break-word',
  alignSelf: 'flex-end',
  marginBottom: '8px',
});

const ReceiverBubble = styled('div')({
  backgroundColor: '#FFFFFF',
  color: '#000',
  padding: '8px 12px',
  borderRadius: '10px',
  maxWidth: '70%',
  wordWrap: 'break-word',
  alignSelf: 'flex-start',
  marginBottom: '8px',
});

// const AvatarContainer = styled('div')({
//   marginRight: '8px',
// });

// const AvatarBubble = styled(Avatar)({
//   backgroundColor: '#3f51b5',
//   color: '#fff',
// });

const TypingText = styled(ListItemText)({
  fontStyle: 'italic',
  color: '#777',
});

const Dashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentMessages, setCurrentMessages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const stompClientRef = useRef(null);
  const messageListRef = useRef(null);
  const [ typing, setTyping ] = useState(null)
  console.log("TYPING: " + typing)

  //WEBSOCKET
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
      console.log('Conexão estabelecida:', frame);
      stompClientRef.current = client;

      client.subscribe('/topic/chat', (message) => {
        const newMessage = JSON.parse(message.body);
        console.log("Nova mensagem recebida:", newMessage);
        
        if (
          (newMessage.senderId === user.id && newMessage.receiverId === selectedUserId) ||
          (newMessage.senderId === selectedUserId && newMessage.receiverId === user.id)
        ) {
          setCurrentMessages((prevMessages) => [...prevMessages, newMessage]);
          scrollToBottom();
        } else {
          console.log("Mensagem descartada");
        }
      });
    }, (error) => {
      console.error('Erro ao conectar ao WebSocket:', error);
    });

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, [user, selectedUserId]);

  //LISTAGEM DE MENSAGENS
  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const response = await axios.get('http://localhost:8080/messages/list');
        setMessages(response.data);
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    };
    fetchAllMessages();
  }, [user, selectedUserId]);

  //FILTRANDO MENSAGENS POR ID DE EMISSOR E RECEPTOR
  useEffect(() => {
    if (selectedUserId) {
      const filteredMessages = messages.filter(
        (message) =>
          (message.senderId === user.id && message.receiverId === selectedUserId) ||
          (message.senderId === selectedUserId && message.receiverId === user.id)
      );
      setCurrentMessages(filteredMessages);
      scrollToBottom();
    }
  }, [selectedUserId, user.id, messages]);

  //PROCURANDO USUARIO DO SISTEMA NA BARRA LATERAL
  //ELIMINANDO DA LISTA SE ENCONTRAR O USUARIO ATUAL
  useEffect(() => {
    const fetchUsersOnClick = async () => {
      try {
        const response = await axios.get('http://localhost:8080/auth/users');
        setUsers(response.data.filter(u => u.id !== user.id)); // Filtrar o próprio usuário
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    };
    fetchUsersOnClick();
  }, [user]);

  //ATIVAR POSICIONAMENTO POR REFERENCIA (ULTIMA MENSAGEM)
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  //PROCURANDO USUARIO POR CLIQUE
  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    setCurrentMessages(messages.filter(
      (message) =>
        (message.senderId === user.id && message.receiverId === userId) ||
        (message.senderId === userId && message.receiverId === user.id)
    ));
    scrollToBottom();
  };

  //ENVIO DE MENSAGENS
  const handleMessageSend = async () => {
    try {
      if (stompClientRef.current && currentMessage.trim() && selectedUserId) {
        const selectedUser = users.find(u => u.id === selectedUserId);

        const messageData = {
          senderId: user.id,
          senderName: user.name,
          receiverId: selectedUser.id,
          receiverName: selectedUser.name,
          message: currentMessage,
          date: new Date().toISOString(),
          status: 'MESSAGE'
        };

        // Envia a mensagem para o servidor via WebSocket
        stompClientRef.current.send('/app/chat', {}, JSON.stringify(messageData));

        // Persiste a mensagem no banco de dados
        await axios.post('http://localhost:8080/messages', messageData);

        // Limpa o campo de mensagem após o envio
        setCurrentMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return (
    <StyledContainer>
      <StyledCard>
        <LeftContainer>
          {users.map(u => (
            <ListItem key={u.id} button onClick={() => handleUserClick(u.id)}>
              <Avatar>{u.name[0]}</Avatar>
              <ListItemText primary={u.name} />
            </ListItem>
          ))}
        </LeftContainer>
        <RightContainer>
          <CardHeader
            avatar={selectedUserId ? <Avatar>{users.find(u => u.id === selectedUserId)?.name[0]}</Avatar> : null}
            title={selectedUserId ? users.find(u => u.id === selectedUserId)?.name : user.name}
            subheader={currentMessage.trim() ? 'Digitando...' : null}
          />
          <MessageList ref={messageListRef} id="message-list">
            {currentMessages.length > 0 ? (
              currentMessages.map((message) => (
                <MessageBox key={message.id}>
                  {/* {message.senderId !== user.id && (
                    <AvatarContainer>
                      <AvatarBubble>{message.senderName[0]}</AvatarBubble>
                    </AvatarContainer>
                  )} */}
                  {message.senderId === user.id ? (
                    <SenderBubble>{message.message}</SenderBubble>
                  ) : (
                    <ReceiverBubble>
                      <ListItemText
                        primary={message.message}
                        secondary={new Date(message.date).toLocaleString()}
                      />
                    </ReceiverBubble>
                  )}
                </MessageBox>
              ))
            ) : (
              <div style={{ alignSelf: 'center' }}>Nenhuma mensagem ainda. Inicie a conversa!</div>
            )}
          </MessageList>
          <TextField
            label="Digite sua mensagem"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            variant="outlined"
            margin="normal"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleMessageSend();
              }
            }}
          />
          <Button onClick={handleMessageSend} disabled={!currentMessage.trim()} variant="contained" color="primary">
            Enviar
          </Button>
        </RightContainer>
      </StyledCard>
    </StyledContainer>
  );
};

export default Dashboard;
