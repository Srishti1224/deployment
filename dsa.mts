import readline from 'readline';
import fetch from 'node-fetch'; // Works without top-level await

// Define the structure of one MCQ
interface MCQ {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
}

// Setup terminal input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve));
}

// Fetch quiz from Ollama
async function fetchQuiz(topic: string): Promise<MCQ[]> {
  const prompt = `
Generate 5 MCQs on the topic "${topic}".
Format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 1,
    "explanation": "...",
    "concept": "..."
  }
]
Return only valid JSON.
`;

  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral',
      prompt,
      stream: false
    })
  });

  const data = await res.json() as { response: string }; // ✅ FIXED TYPE ERROR
  const match = data.response.match(/\[\s*{[\s\S]*}\s*\]/);
  if (!match) throw new Error('Could not parse JSON response');

  return JSON.parse(match[0]);
}

// Main quiz logic
async function runQuiz() {
  const topic = await ask('📝 Enter the topic you want a quiz on: ');
  console.log(`\n🎯 Generating quiz for "${topic}"...\n`);

  const quiz = await fetchQuiz(topic);
  let score = 0;

  for (let i = 0; i < quiz.length; i++) {
    const q = quiz[i];
    console.log(`Q${i + 1}: ${q.question}`);
    q.options.forEach((opt, idx) => console.log(`   ${idx + 1}. ${opt}`));

    const ans = await ask('👉 Your answer (1-4): ');
    const userChoice = parseInt(ans) - 1;

    const isCorrect = userChoice === q.correctAnswer;
    if (isCorrect) {
      console.log('✅ Correct!\n');
      score++;
    } else {
      console.log('❌ Incorrect.\n');
    }
  }

  const percent = (score / quiz.length) * 100;
  console.log(`📊 Your Score: ${score}/${quiz.length} (${percent.toFixed(0)}%)`);

  if (percent >= 70) {
    console.log('🎉 You’re ready to move to the next topic!');
  } else {
    console.log('🧠 Please revise this topic before proceeding.');
  }

  rl.close();
}

runQuiz();
