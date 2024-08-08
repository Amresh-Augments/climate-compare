import { COUNTRIES, USER } from "./data.js";
import NodeCache from "node-cache";
import bodyparser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { generateClimateData } from "./helpers.js";
import jsonwebtoken from "jsonwebtoken";

const { sign, verify } = jsonwebtoken;
const { json } = bodyparser;

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

const cache = new NodeCache();

const port = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error("SECRET_KEY environment variable is not set");
}

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  verify(token, secretKey, (err, decoded) => {
    if (err)
      return res.status(500).json({ error: "Failed to authenticate token" });
    req.userId = decoded.id;
    next();
  });
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (
    !username ||
    !password ||
    username !== USER.username ||
    password !== USER.password
  ) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = sign({ username: USER.username }, secretKey, {
    expiresIn: "1d",
  });
  res.json({ token });
});

app.get("/climate/:country", verifyToken, (req, res) => {
  const { country } = req.params;
  const { forecastDays } = req.query;

  if (!country || !forecastDays) {
    return res
      .status(403)
      .json({ error: "Country and forecastDays are required" });
  }

  if (!COUNTRIES.includes(country)) {
    return res.status(404).json({ error: "Country not found" });
  }

  const cacheKey = `${country}-${forecastDays}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  const climateData = generateClimateData(country, forecastDays);

  cache.set(cacheKey, climateData, 3600); // Cache for 1 hour
  res.json(climateData);
});

app.get("/countries", verifyToken, (req, res) => {
  return res.json(COUNTRIES);
});

app.listen(port, () => {
  console.log(`ClimateCompare API running on port ${port}.`);
});
