import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { connectedClients } from '../socket';

const router = express.Router();
const sessions = new Map();

function getSessionData() {
  return [...sessions.values()];
}

function getSessionById(id: string) {
  return sessions.get(id);
}

function storeSession(sessionId, user) {
  console.log('Storing session', JSON.stringify(user));
  sessions.set(sessionId, user);
}

function generateSessionId() {
  return uuidv4();
}

router.get('/connections', async (req, res) => {
  try {
    console.log(connectedClients);
    const users = Array.from(connectedClients.entries());
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(200).json({ exists: true });
    }

    res.status(200).json({ exists: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username: username,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.VITE_REACT_JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .send({ error: 'Failed to get user after registration' });
    }

    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send({ error: 'Authentication failed' });
    }

    let isUserLoggedIn = false;

    for (const userInfo of connectedClients.values()) {
      if (userInfo.username === username) {
        isUserLoggedIn = true;
        break;
      }
    }

    if (isUserLoggedIn) {
      return res.status(401).send({ error: 'User already logged in' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ error: 'Incorrect Password. Authentication failed.' });
    }

    const sessionId = generateSessionId();
    storeSession(sessionId, user);
    const token = jwt.sign(
      { userId: user._id, username: user.username, sessionId },
      process.env.VITE_REACT_JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.status(200).send({ token, user });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/validate-token', (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.VITE_REACT_JWT_SECRET || 'secret'
    );
    const { userId, username, sessionId } = decoded;

    // const user = getSessionData(sessionId);

    if (!sessionId || !userId || !username) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    res.json({ id: userId, username, sessionId });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

router.delete('/clear', async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).send({ message: 'User database cleared successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to clear the user database' });
  }
});

export default router;
