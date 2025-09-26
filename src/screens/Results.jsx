import React, { useEffect, useMemo, useState } from 'react'
import { generateFeedback } from '../lib/gemini'

export default function Results({ topic, questions, answers, score, onRestart }) {
	const total = questions.length

	const mistakes = useMemo(() => {
		return questions.map((q, i) => {
			const ans = answers[i]
			const correct = q.options.find(o => o.isCorrect)?.id
			return ans?.isCorrect ? null : {
				question: q.question,
				selected: ans?.selectedId ?? 'none',
				correct,
				explanation: q.explanation
			}
		}).filter(Boolean)
	}, [questions, answers])

	const [feedback, setFeedback] = useState('Generating personalized feedback…')
	const [error, setError] = useState(null)

	useEffect(() => {
		let cancelled = false
		generateFeedback({ topic, score, total, mistakes })
			.then(text => { if (!cancelled) setFeedback(text) })
			.catch(e => { if (!cancelled) setError(e.message) })
		return () => { cancelled = true }
	}, [topic, score, total, mistakes])

	return (
		<div className="card">
			<div className="title">Your results</div>
			<p className="subtitle">Score: {score} / {total}</p>

			<div style={{whiteSpace:'pre-wrap', marginTop:8}}>
				{error ? `Could not fetch feedback: ${error}` : feedback}
			</div>

			<div style={{marginTop:16}}>
				<button className="btn" onClick={onRestart}>Try another topic</button>
			</div>
		</div>
	)
}