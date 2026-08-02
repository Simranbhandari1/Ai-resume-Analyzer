const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use((req, res, next) => {
  console.log('REQUEST:', req.method, req.originalUrl);
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://ai-resume-analyzer-smoky-eight.vercel.app',
      'https://ai-resume-analyzer-7aw9co234-simrans-projects-654e77f7.vercel.app',
    ],
    credentials: true,
  }),
);

/* require all the routes here */
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

/* using all the routes here */
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;
