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
});

const Dashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const stompClientRef = useRef(null);
  const messageListRef = useRef(null);

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

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    setCurrentMessages([]);
  };

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

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
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
          />
          <MessageList ref={messageListRef}>
            {currentMessages.length > 0 ? (
              currentMessages.map((message) => (
                <ListItem key={message.id}>
                  {message.senderId === user.id ? (
                    <ListItemText
                      primary={message.message}
                      secondary={message.date}
                      sx={{ alignSelf: 'flex-end' }}
                    />
                  ) : (
                    <ListItemText
                      primary={`${message.senderName}: ${message.message}`}
                      secondary={message.date}
                      sx={{ alignSelf: 'flex-start' }}
                    />
                  )}
                </ListItem>
              ))
            ) : (
              <div>Nenhuma mensagem ainda. Inicie a conversa!</div>
            )}
          </MessageList>
          <TextField
            label="Digite sua mensagem"
            value={currentMessage}
            onChange={e => setCurrentMessage(e.target.value)}
            variant="outlined"
            margin="normal"
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
