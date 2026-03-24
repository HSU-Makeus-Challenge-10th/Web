import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

type ThemeContextType = {
  isDark: boolean;
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggle: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const toggle = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ 추가
export const useTheme = () => {
  return useContext(ThemeContext);
};
