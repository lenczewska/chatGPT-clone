import express from "express";
import cors from "cors";
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Создаем базу данных
const db = new Database("database.db");

// СОЗДАЕМ ТАБЛИЦЫ ВРУЧНУЮ!
db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    emailVerified INTEGER DEFAULT 0,
    name TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    image TEXT,
    twoFactorEnabled INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    expiresAt INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    idToken TEXT,
    expiresAt INTEGER,
    password TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt INTEGER NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );
`);

console.log("✅ Таблицы созданы!");

// Better Auth конфигурация
const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:5173"],
  baseURL: "http://localhost:5000",
});

// Конвертируем Express запрос в Web Request
app.all("/api/auth/*", async (req, res) => {
  try {
    const url = `http://localhost:5000${req.url}`;
    
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) headers.set(key, Array.isArray(value) ? value[0] : value);
    });

    const webRequest = new Request(url, {
      method: req.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(req.method) ? null : JSON.stringify(req.body),
    });

    const webResponse = await auth.handler(webRequest);

    res.status(webResponse.status);
    
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const responseText = await webResponse.text();
    res.send(responseText);

  } catch (error) {
    console.error("❌ Ошибка:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Backend работает!" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server запущен на http://localhost:${PORT}`);
  console.log(`📍 Auth endpoint: http://localhost:${PORT}/api/auth`);
});