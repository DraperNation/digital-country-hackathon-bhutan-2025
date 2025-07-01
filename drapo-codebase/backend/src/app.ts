import express, { Request, Response, NextFunction } from 'express';
import indexRouter from './routes/index.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('eBhutan Super App Backend is running.');
});

app.use(indexRouter);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
