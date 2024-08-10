import { COUNTRIES, USER } from './data.js';

import NodeCache from 'node-cache';
import bodyparser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { generateClimateData } from './helpers.js';
import jsonwebtoken from 'jsonwebtoken';

const { sign, verify } = jsonwebtoken;

const { json } = bodyparser;

// CODE FOR TASK 2.2 -------------------------------------------

const app = express();
app.use(cors());
app.use(express.json());

// END OF CODE FOR TASK 2.2 ------------------------------------

// CODE FOR TASK 2.3 -------------------------------------------

dotenv.config();
const cache = new NodeCache();

// END OF CODE FOR TASK 2.3 ------------------------------------

const port = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  // CODE FOR TASK 2.4 -------------------------------------------

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Token not provided' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Token verification failed' });
    }

    req.user = user;
    next();
  });

  // END OF CODE FOR TASK 2.4 ------------------------------------
};

app.post('/login', (req, res) => {
  // CODE FOR TASK 2.5 -------------------------------------------

  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(401)
      .json({ error: 'Username and password are required' });
  }

  if (username !== USER.username || password !== USER.password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  try {
    const token = jwt.sign({ username }, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });
    res.json({ token });
  } catch (error) {
    // console.error('Token Generation Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

  // END OF CODE FOR TASK 2.5 ------------------------------------
});

app.get('/climate/:country', verifyToken, (req, res) => {
  // CODE FOR TASK 2.6 -------------------------------------------
  // END OF CODE FOR TASK 2.6 ------------------------------------
});

app.get('/countries', verifyToken, (req, res) => {
  return res.json(COUNTRIES);
});

app.listen(port, () => {
  console.log(`ClimateCompare API running on port ${port}.`);
});
