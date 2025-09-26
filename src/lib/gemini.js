import { GoogleGenerativeAI } from '@google/generative-ai'

// === CONFIG ===
// AI model to use
const MODEL = 'gemini-2.5-flash' 

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

//  Prompt text for quiz generation ===
function promptForTopic(topic) {
  return `You are a strict quiz generator.

Generate exactly 5 MCQs about "${topic}".
Return ONLY valid JSON (no markdown, no comments) in this format:

{
  "topic": string,
  "questions": [
    {
      "id": string,
      "question": string,
      "options": [
        { "id": "a", "text": string, "isCorrect": boolean },
        { "id": "b", "text": string, "isCorrect": boolean },
        { "id": "c", "text": string, "isCorrect": boolean },
        { "id": "d", "text": string, "isCorrect": boolean }
      ],
      "explanation": string
    }
  ]
}

Rules:
- Exactly one option must have "isCorrect": true.
- Avoid trick questions.
- Use clear, concise language.
- Keep explanations to 1-2 sentences.
- Output pure JSON only.
`
}


// Checks if the AI-generated JSON matches our quiz structure
function validateQuiz(quiz) {
  try {
    const data = typeof quiz === 'string' ? JSON.parse(quiz) : quiz

    // check topic
    if (!data.topic || typeof data.topic !== 'string') return false

    // check questions array
    if (!Array.isArray(data.questions) || data.questions.length !== 5) return false

    for (const q of data.questions) {
      if (!q.id || !q.question || !q.explanation) return false
      if (!Array.isArray(q.options) || q.options.length !== 4) return false

      // check exactly one correct option
      const correctCount = q.options.filter(o => o.isCorrect).length
      if (correctCount !== 1) return false

      for (const o of q.options) {
        if (!o.id || !o.text || typeof o.isCorrect !== 'boolean') return false
      }
    }

    return true
  } catch (e) {
    return false
  }
}

// === GENERATE QUIZ ===
export async function generateQuiz(topic, { retries = 2 } = {}) {
  let lastError = null

  // try multiple times if AI returns invalid JSON
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: MODEL })
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: promptForTopic(topic) }] }]
      })

      const text = result.response.text().trim()

      // validate the AI output
      if (validateQuiz(text)) {
        return JSON.parse(text) // safe to use now
      }

      lastError = 'Generated quiz failed validation'
    } catch (e) {
      lastError = e
    }
  }

  throw new Error(`Failed to generate valid quiz JSON: ${lastError}`)
}

//  Prompt for feedback
function feedbackPrompt({ topic, score, total, mistakes }) {
  // Format missed questions for feedback
  const missed = mistakes
    .map(m => `Q: ${m.question}\nYour answer: ${m.selected}\nCorrect: ${m.correct}\nWhy: ${m.explanation}`)
    .join('\n\n')

  return `You are a helpful tutor.

Topic: ${topic}
Score: ${score}/${total}

Provide a short, encouraging feedback paragraph (80-120 words) tailored to this performance.
Mention 1-3 key areas to focus on.

Here are the missed questions:
${missed || 'None'}

Return plain text (no markdown).`
}

// === GENERATE FEEDBACK ===
export async function generateFeedback({ topic, score, total, mistakes }) {
  const model = genAI.getGenerativeModel({ model: MODEL })
  const res = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: feedbackPrompt({ topic, score, total, mistakes }) }] }]
  })

  return res.response.text().trim()
}


// import { GoogleGenerativeAI } from '@google/generative-ai'
// import { validateQuizJson } from './schema'

// const MODEL = 'gemini-2.5-flash' // swap to 'gemini-1.5-pro' if you want

// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

// function promptForTopic(topic) {
// 	return `You are a strict quiz generator.

// Generate exactly 5 MCQs about "${topic}".
// Return ONLY valid JSON that matches this schema (no markdown, no comments):

// {
//   "topic": string,
//   "questions": [
// 	{
// 	  "id": string,
// 	  "question": string,
// 	  "options": [
// 		{ "id": "a", "text": string, "isCorrect": boolean },
// 		{ "id": "b", "text": string, "isCorrect": boolean },
// 		{ "id": "c", "text": string, "isCorrect": boolean },
// 		{ "id": "d", "text": string, "isCorrect": boolean }
// 	  ],
// 	  "explanation": string
// 	}
//   ]
// }

// Rules:
// - Exactly one option must have "isCorrect": true.
// - Avoid trick questions.
// - Use clear, concise language.
// - Keep explanations to 1-2 sentences.
// - Do NOT wrap with markdown fences. Output pure minified JSON.
// `
// }

// export async function generateQuiz(topic, { retries = 2 } = {}) {
// 	let lastError = null
// 	for (let attempt = 0; attempt <= retries; attempt++) {
// 		try {
// 			const model = genAI.getGenerativeModel({ model: MODEL })
// 			const result = await model.generateContent({
// 				contents: [{ role: 'user', parts: [{ text: promptForTopic(topic) }] }]
// 			})
// 			const text = result.response.text().trim()

// 			const validation = validateQuizJson(text)
// 			if (validation.success) {
// 				return validation.data
// 			}
// 			lastError = validation.error
// 		} catch (e) {
// 			lastError = e
// 		}
// 	}
// 	throw new Error(`Failed to generate valid quiz JSON: ${lastError}`)
// }

// function feedbackPrompt({ topic, score, total, mistakes }) {
// 	const missed = mistakes.map(m => `Q: ${m.question}\nYour answer: ${m.selected}\nCorrect: ${m.correct}\nWhy: ${m.explanation}`).join('\n\n')
// 	return `You are a helpful tutor.

// Topic: ${topic}
// Score: ${score}/${total}

// Provide a short, encouraging feedback paragraph (80-120 words) tailored to this performance.
// Mention 1-3 key areas to focus on.

// Here are the missed questions:
// ${missed || 'None'}

// Return plain text (no markdown).`
// }

// export async function generateFeedback({ topic, score, total, mistakes }) {
// 	const model = genAI.getGenerativeModel({ model: MODEL })
// 	const res = await model.generateContent({
// 		contents: [{ role: 'user', parts: [{ text: feedbackPrompt({ topic, score, total, mistakes }) }] }]
// 	})
// 	return res.response.text().trim()
// }