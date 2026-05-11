import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { port: 3000, host: true },
  integrations: [react()],
});
