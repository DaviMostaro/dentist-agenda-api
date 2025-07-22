import express from 'express';
import { authRouter } from './auth.routes';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Dentist Agenda API');
});

router.get('/health', (req, res) => {
  res.json({ message: 'API is healthy' });
});

router.use(authRouter);


export default router;