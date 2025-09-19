import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const value = { isLoading, setIsLoading };
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => useContext(UIContext);