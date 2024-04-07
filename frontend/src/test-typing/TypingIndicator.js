import React from 'react';
import { useTypingContext } from './TypingContext';

const TypingIndicator = () => {
  const { isTyping, typingUser } = useTypingContext();

  return (
    <div>
      {isTyping && typingUser && (
        <p>{typingUser.name} está digitando...</p>
      )}
    </div>
  );
};

export default TypingIndicator;
