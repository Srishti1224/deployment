const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/generate-quiz', async (req, res) => {
  const topic = req.body.topic;

  const prompt = `
You are an expert in data structures and algorithms.

Given the list of topics: ${topic}, generate exactly 5 multiple choice questions (MCQs) per topic, resulting in a total of ${5 * topic.length}.

Each question must:

- Be related to the topic.
- Have 4 options.
- Only one correct option (0-based index).
- Include a short explanation.

Format as a JSON array like:

[
  {
    "question": "Question text?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 2,
    "explanation": "Why it's correct.",
    "topic": "from ${topic}"
  }
]
`;

  try {
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt,
        stream: false,
      }),
    });

    const data = await ollamaRes.json();
    const match = data.response.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!match) throw new Error('Could not parse response');

    const rawQuiz = JSON.parse(match[0]);

    const quiz = rawQuiz.map((q, index) => ({
      id: (index + 1).toString(),
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      topic: q.topic || topic.join(', '),
    }));

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}/generate-quiz`));
