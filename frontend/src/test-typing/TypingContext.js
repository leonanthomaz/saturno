import React, { createContext, useState, useContext } from 'react';

const TypingContext = createContext();

export const useTypingContext = () => {
  return useContext(TypingContext);
};

export const TypingProvider = ({ children }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const startTyping = (user) => {
    setIsTyping(true);
    setTypingUser(user);
  };

  const stopTyping = () => {
    setIsTyping(false);
    setTypingUser(null);
  };

  return (
    <TypingContext.Provider
      value={{
        isTyping,
        typingUser,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
};
