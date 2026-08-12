import express from 'express';
import { config } from './config.ts';
import { chatRouter } from './routes/chat.ts';
import { gigsRouter } from './routes/gigs.ts';

const app = express();

app.use(express.json());
app.use('/api/gigs', gigsRouter);
app.use('/api/chat', chatRouter);

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
