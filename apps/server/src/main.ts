import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { initializeSocketIO } from './socket';
import dotenv from 'dotenv';
import { connectDB } from './database';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
connectDB();

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || '').split(',');

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

const server = http.createServer(app);
initializeSocketIO(server);

import statusRoutes from './api/status';
app.use('/api/status', statusRoutes);

import gameHistory from './api/game_history';
import unitsRoutes from './api/units';
import rollRoutes from './api/roll';

app.use('/api/game_history', gameHistory);
app.use('/api/units', unitsRoutes);
app.use('/api/roll', rollRoutes);

app.use(express.static(path.join(__dirname, '../../dist/apps/client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../apps/client/index.html'));
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Listening on: ${port}`);
});
