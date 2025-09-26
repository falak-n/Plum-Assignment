import React, { useMemo, useState } from 'react'
import { generateQuiz } from '../lib/gemini'
import RetryNotice from '../components/RetryNotice.jsx'

const DEFAULT_TOPICS = [
	'Wellness Basics',
	'Nutrition',
	'Tech Trends',
	'JavaScript',
	'Cybersecurity',
	'Climate & Sustainability'
]

export default function TopicSelect({ onStart }) {
	const [topics] = useState(DEFAULT_TOPICS)
	const [selected, setSelected] = useState(topics[0])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const handleGenerate = async () => {
		setLoading(true)
		setError(null)
		try {
			const quiz = await generateQuiz(selected, { retries: 2 })
			onStart(selected, quiz.questions)
		} catch (e) {
			setError(e)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="card">
			<div className="title">Choose a topic</div>
			<p className="subtitle">AI will generate 5 MCQs for your practice.</p>

			<div className="row">
				{topics.map(t => (
					<button
						key={t}
						className={`topic ${selected === t ? 'selected' : ''}`}
						onClick={() => setSelected(t)}
					>
						{t}
					</button>
				))}
			</div>

			<div style={{marginTop:16, display:'flex', gap:8}}>
				<button className="btn" onClick={handleGenerate} disabled={loading}>
					{loading ? 'Generating…' : 'Start Quiz'}
				</button>
			</div>

			{error && <div style={{marginTop:16}}><RetryNotice message={error.message} onRetry={handleGenerate} /></div>}
		</div>
	)
}