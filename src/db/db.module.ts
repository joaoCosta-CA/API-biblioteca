import { Module, Global } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DRIZZLE = 'DRIZZLE';

@Global() // Torna o banco acessível em todo o projeto sem precisar importar em cada módulo 
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
  // Use exatamente esta linha para buscar o valor do .env
        const dbUrl = configService.get<string>('DATABASE_URL'); 

        if (!dbUrl || typeof dbUrl !== 'string') {
          throw new Error('ERRO: DATABASE_URL não é uma string válida. Verifique seu .env');
        }

        const pool = new Pool({ 
          connectionString: dbUrl 
        });

        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}