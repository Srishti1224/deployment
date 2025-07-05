import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateQuiz from './dsa';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-quiz', async (req, res) => {
  try {
    const topic = req.body.topic;
    const quiz = await generateQuiz(topic);
    res.json(quiz);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/generate-quiz`);
});
