// src/pages/Register.js
import React, { useState } from 'react';
import { Typography, Container, Grid, TextField, Button, InputLabel, MenuItem, FormControl, Select, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useAppContext } from '../../contexts/AppContext';

const StyledForm = styled('form')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const Register = () => {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
            
      console.log("Sucesso! Dados: ", response.data);
    } catch (error) {
      console.error('Erro ao enviar dados para a API:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
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
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Nível de Acesso</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="USER">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <StyledButton type="submit" fullWidth variant="contained" color="primary">
          Register
        </StyledButton>
      </StyledForm>
      <Typography variant="body2" align="center">
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </Container>
  );
};