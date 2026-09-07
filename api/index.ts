import express from 'express';
import { apiRouter } from '../src/server/api';

const app = express();
app.use(express.json({ limit: '50mb' }));

// Vercel serverless function entrypoint
app.use('/api', apiRouter);

export default app;
