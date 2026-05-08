import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // swc 하나만 사용

export default defineConfig({
  plugins: [react()],
})