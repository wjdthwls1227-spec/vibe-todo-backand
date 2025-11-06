require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const todosRouter = require('./routes/todos');

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo';

if (!process.env.MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI 환경변수가 설정되지 않았습니다. 기본값을 사용합니다.');
} else {
  console.log('✅ MONGODB_URI 환경변수 확인됨');
}

app.get('/', (_req, res) => {
  res.json({ message: 'Todo Backend API is running' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/todos', todosRouter);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('연결 성공');
    console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // 비밀번호 마스킹
    console.log('연결된 데이터베이스:', mongoose.connection.db.databaseName);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server ready on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB 연결 실패', error);
    process.exit(1);
  }
}

start();



