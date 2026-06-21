import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  publicDir: 'educational_game_content',
  base: command === 'build' ? '/gioco-mate-lettura/' : '/',
}));
