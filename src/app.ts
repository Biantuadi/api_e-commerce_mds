import 'reflect-metadata';  // Requis par TypeORM
import express, { Application } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import config from './config/env.config';
import router from './routes/index.routes';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/db.config'; 

dotenv.config();

const app: Application = express();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

// Routes
app.use(router); 

// Start the server
const port = config.port || 3000;
const httpServer = createServer(app);

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  
  // Connect to the database after the server starts
  connectToDatabase()
    .then(() => {
      console.log('Connected to MySQL database successfully');
    })
    .catch((error) => {
      console.error('Database connection failed:', error);

    });
});
