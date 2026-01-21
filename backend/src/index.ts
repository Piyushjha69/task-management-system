import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);

app.use('/tasks', taskRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Healthy');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});