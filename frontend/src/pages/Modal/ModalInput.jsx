import React, { useState } from 'react';
import { Modal, Button, Typography, TextField, Grid } from '@mui/material';

export const ModalInput = ({ open, handleClose, title, handleInput }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleConfirm = () => {
    handleInput(inputValue);
    setInputValue(''); // Limpar o campo de entrada após a confirmação
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Grid container direction="column" justifyContent="center" alignItems="center" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', width: '300px' }}>
        <Typography variant="h5" gutterBottom>{title}</Typography>
        <TextField
          value={inputValue}
          onChange={handleInputChange}
          variant="outlined"
          label="Digite aqui"
          fullWidth
          style={{ marginBottom: '10px' }}
        />
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button variant="contained" onClick={handleConfirm} fullWidth>Confirmar</Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" onClick={handleClose} color="error" fullWidth>Cancelar</Button>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};
