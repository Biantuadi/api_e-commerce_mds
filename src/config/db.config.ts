import { createConnection } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();  // Charger les variables d'environnement

export const connectToDatabase = async () => {
  try {
    const connection = await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['src/entity/**/*.ts'],
      synchronize: true,
      // logging: true,
      // dropSchema: true
    });
    return connection;
  } catch (error) {
    throw error;  // Optionnel : propager l'erreur si besoin
  }
};
