import express, { Application } from 'express';
import cors from 'cors';
import { APP_URL } from './config/env';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: APP_URL,
    credentials: true,
}));

app.all('/api/auth/{*any}', toNodeHandler(auth));
// app.use('/api', );

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

export default app;