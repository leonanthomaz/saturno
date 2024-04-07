// Modal.js
import React from 'react';
import { Modal, Button } from '@mui/material';

export const ModalComponent = ({ open, handleClose, title, content }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
        <h2 id="modal-modal-title">{title}</h2>
        <p id="modal-modal-description">{content}</p>
        <Button onClick={handleClose}>Close</Button>
      </div>
    </Modal>
  );
};