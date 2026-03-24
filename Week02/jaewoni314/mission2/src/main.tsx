import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { TodoProvider } from './context/TodoContext.tsx';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <TodoProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </TodoProvider>
  </ThemeProvider>
);
