import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { Container, TextField, Button, Card, CardHeader, Avatar, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/system';

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
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f0f0f0', // Fundo cinza claro
});

const RightContainer = styled('div')({
  flex: 1,
  background: 'url(https://hdwallsource.com/img/2014/8/my-neighbor-totoro-wallpaper-27981-28703-hd-wallpapers.jpg) center center',
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
});

const Content = styled('div')({
  marginTop: 0,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

const AvatarWrapper = styled(Avatar)({
  margin: '10px',
});

const MessageList = styled(List)({
  overflowY: 'auto',
  flexGrow: 1,
});

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    };
    fetchUsers();
  }, []);

  const fetchMessages = async () => {
    try {
      if (selectedUserId) {
        const selectedUser = users.find(user => user.id === selectedUserId);
        const response = await axios.get(`http://localhost:8080/users/${selectedUser.email}`);
        setMessages(response.data);
      } else {
        console.log('Email do usuário é nulo. Abrir nova conversa aqui.');
      }
    } catch (error) {
      console.error('Erro ao obter mensagens:', error);
    }
  };

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    fetchMessages();
  };

  const handleMessageSend = async () => {
    try {
      if (stompClient && currentMessage.trim() && selectedUserId) {
        const selectedUser = users.find(user => user.id === selectedUserId);
        const messageData = {
          senderName: selectedUser.name,
          receiverId: selectedUser.id,
          receiverName: selectedUser.name,
          message: currentMessage,
          date: new Date().toISOString(),
          status: 'MESSAGE'
        };

        stompClient.send('/app/chat', {}, JSON.stringify(messageData));
        setCurrentMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return (
    <StyledContainer>
      <StyledCard>
        <LeftContainer>
          {users.map(user => (
            <AvatarWrapper key={user.id} onClick={() => handleUserClick(user.id)} alt={user.name} src={`https://randomuser.me/api/portraits/thumb/men/${user.id}.jpg`} />
          ))}
        </LeftContainer>
        <RightContainer>
          <Content>
            {messages.length > 0 ? (
              <MessageList>
                {messages.map(message => (
                  <ListItem key={message.id}>
                    <Avatar>{message.senderName[0]}</Avatar>
                    <ListItemText primary={message.senderName} secondary={message.message} />
                  </ListItem>
                ))}
              </MessageList>
            ) : (
              <div>Nenhuma mensagem ainda. Inicie a conversa!</div>
            )}
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
          </Content>
        </RightContainer>
      </StyledCard>
    </StyledContainer>
  );
};

export default Dashboard;
