import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import supabase from './config/supabase.js';
import analyzeRouter from './routes/analyze.js';
import certificateRouter from './routes/certificate.js';
import certificatesRouter from './routes/certificates.js';
import authRouter from './routes/auth.js';
import errorHandler from './middleware/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database
connectDB();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/certificate', certificateRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/analysis', analyzeRouter); // GET analysis by ID

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

