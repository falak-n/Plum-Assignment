import React, { useMemo, useState } from 'react'
import QuestionCard from '../components/QuestionCard.jsx'
import ProgressBar from '../components/ProgressBar.jsx'

export default function Quiz({ topic, questions, onFinish, onQuit }) {
	const [index, setIndex] = useState(0)
	const [selections, setSelections] = useState({}) // idx -> {selectedId, isCorrect}
	const [locked, setLocked] = useState(false)

	const q = questions[index]
	const total = questions.length

	const selection = selections[index] || null

	const submitSelection = (selectedId) => {
		if (locked) return
		const correctId = q.options.find(o => o.isCorrect)?.id
		const isCorrect = selectedId === correctId
		setSelections(prev => ({ ...prev, [index]: { selectedId, isCorrect, correctId } }))
		setLocked(true)
	}

	const goNext = () => {
		if (index < total - 1) {
			setIndex(index + 1)
			setLocked(!!selections[index + 1])
		}
	}

	const goPrev = () => {
		if (index > 0) {
			setIndex(index - 1)
			setLocked(!!selections[index - 1])
		}
	}

	const finish = () => {
		const collected = Array.from({ length: total }).map((_, i) => selections[i] || { selectedId: null, isCorrect: false })
		const score = collected.filter(a => a.isCorrect).length
		onFinish(score, collected)
	}

	const progress = index + 1

	return (
		<div className="card">
			<div className="title">{topic}</div>
			<div className="small" style={{margin:'6px 0 12px'}}>Question {progress} of {total}</div>
			<ProgressBar value={progress} max={total} />

			<div style={{marginTop:16}}>
				<QuestionCard
					q={q}
					selection={selection}
					onSelect={submitSelection}
					locked={locked}
				/>
			</div>

			<div className="row" style={{justifyContent:'space-between', marginTop:8}}>
				<div style={{display:'flex', gap:8}}>
					<button className="btn secondary" onClick={goPrev} disabled={index === 0}>Prev</button>
					<button className="btn secondary" onClick={goNext} disabled={index === total - 1}>Next</button>
				</div>

				<div style={{display:'flex', gap:8}}>
					<button className="btn secondary" onClick={onQuit}>Quit</button>
					<button className="btn" onClick={finish} disabled={Object.keys(selections).length < total}>Finish</button>
				</div>
			</div>
		</div>
	)
}