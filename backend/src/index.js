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

// END OF CODE FOR TASK 2.3 ------------------------------------

const port = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  // CODE FOR TASK 2.4 -------------------------------------------
  // END OF CODE FOR TASK 2.4 ------------------------------------
};

app.post('/login', (req, res) => {
  // CODE FOR TASK 2.5 -------------------------------------------
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
