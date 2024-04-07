import React from 'react';
import { Modal, Button, Typography, Grid } from '@mui/material';

export const ModalConfirmation = ({ open, handleClose, title, content, handleConfirm }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Grid container direction="column" justifyContent="center" alignItems="center" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', width: '300px' }}>
        <Typography variant="h5" gutterBottom>{title}</Typography>
        <Typography gutterBottom>{content}</Typography>
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
