import React from 'react';
import { useTypingContext } from './TypingContext';

const InputField = () => {
  const { startTyping, stopTyping } = useTypingContext();

  const handleTyping = (event) => {
    // Lógica para detectar digitação e obter o usuário atual
    const currentUser = getCurrentUser(); // Exemplo de como obter o usuário atual

    if (event.key === 'Enter') {
      stopTyping();
    } else {
      startTyping(currentUser);
    }
  };

  return (
    <input type="text" onKeyPress={handleTyping} />
  );
};

export default InputField;
