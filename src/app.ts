import 'reflect-metadata';  // Required by TypeORM
import express, { Application } from 'express';
import { createServer } from 'http';
import { createConnection } from 'typeorm';  // Import TypeORM's createConnection
import cors from 'cors';
import fileUpload from 'express-fileupload';
import config from './config/env.config';
import router from './routes/index.routes';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

const app: Application = express();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

// Database Connection
createConnection({
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
})
  .then(() => {
    console.log('Connected to MySQL database successfully');
    
    // Start the server after the DB connection is successful
    const httpServer = createServer(app);
    const port = config.port;

    // Routes
    app.use(router);

    httpServer.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error: any) => {
    console.error('Database connection failed:', error);
  });
