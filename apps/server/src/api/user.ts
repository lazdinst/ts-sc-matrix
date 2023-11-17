import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const sessions = new Map();

function getSessionData(id: string) {
  return sessions.get(id);
}

function storeSession(sessionId, user) {
  sessions.set(sessionId, user);
}

function generateSessionId() {
  return uuidv4();
}

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
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User registered successfully', token });
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
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send(error);
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

router.post('/validate-token', (req, res, next) => {
  const token = req.body.token; // Assuming the token is sent in the request body

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.VITE_REACT_JWT_SECRET || 'secret'
    );
    const sessionId = decoded.sessionId;

    // Retrieve user data from the session using the sessionId
    const user = getSessionData(sessionId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    // Attach user data to the response
    res.json({ user });
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
