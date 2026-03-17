import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle', // Pasta onde as migrations serão geradas [cite: 133]
  schema: './src/db/schema.ts', // Localização do seu arquivo de tabelas [cite: 134]
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});