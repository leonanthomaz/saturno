import React, { useState } from 'react';
import { Typography, Container, Grid, TextField, Button, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate

const StyledForm = styled('form')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const Login = () => {
  const { dispatch } = useAppContext();
  const navigate = useNavigate(); // Obtenha a função navigate

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      console.log("TOKEN: " + response.data.token)
      dispatch({ type: 'SET_TOKEN', payload: response.data.token });
      console.log("USER: " + response.data.user)
      console.log("Sucesso! Dados: ", response.data);

      // Redirecionar para o dashboard após definir o token
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao enviar dados para a API:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.registration}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Grid>
        </Grid>
        <StyledButton type="submit" fullWidth variant="contained" color="primary">
          Login
        </StyledButton>
      </StyledForm>
      <Typography variant="body2" align="center">
        Not Already have an account? <Link to="/register">Register</Link>
      </Typography>
    </Container>
  );
};
