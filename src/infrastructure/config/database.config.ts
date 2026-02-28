import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: process.env.DB_TYPE || 'memory',
  
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT 
      ? parseInt(process.env.POSTGRES_PORT, 10) 
      : 5432,  // Verifica se existe antes de fazer parseInt
    user: process.env.POSTGRES_USER || 'parking_user',
    password: process.env.POSTGRES_PASSWORD || 'parking_password',
    database: process.env.POSTGRES_DB || 'parking_db',
  },
  
  sqlserver: {
    host: process.env.SQL_SERVER_HOST || 'localhost',
    port: process.env.SQL_SERVER_PORT 
      ? parseInt(process.env.SQL_SERVER_PORT, 10) 
      : 1433,  // Verifica se existe antes de fazer parseInt
    user: process.env.SQL_SERVER_USER || 'sa',
    password: process.env.SQL_SERVER_PASSWORD || 'YourStrong!Password',
    database: process.env.SQL_SERVER_DB || 'parking_db',
  },
}));