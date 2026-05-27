import express from 'express';
import cors from 'cors';
import { getDuties, createDuty, updateDuty, deleteDuty } from './controllers/duty.controller';
import { requestLogger } from './middleware/logger.middleware';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/api/duties', getDuties);
app.post('/api/duties', createDuty);
app.put('/api/duties/:id', updateDuty);
app.delete('/api/duties/:id', deleteDuty);

app.get('/test', (req, res) => {
  res.json({ message: "Backend is working via app.ts!" });
});

app.use(errorHandler);

export default app;