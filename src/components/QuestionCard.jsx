import React from 'react'

export default function QuestionCard({
	q,
	selection,
	onSelect,
	locked
}) {
	const selectedId = selection?.selectedId
	const isCorrect = selection?.isCorrect

	return (
		<div className="card">
			<div className="title">{q.question}</div>
			<div className="row" style={{flexDirection:'column'}}>
				{q.options.map(opt => {
					const isSelected = selectedId === opt.id
					const classNames = [
						'option',
						locked && isSelected && (isCorrect ? 'correct' : 'wrong'),
						locked && !isSelected ? 'disabled' : ''
					].filter(Boolean).join(' ')
					return (
						<button
							key={opt.id}
							className={classNames}
							onClick={() => !locked && onSelect(opt.id)}
							disabled={locked}
						>
							<span className="kbd">{opt.id.toUpperCase()}</span>
							<span>{opt.text}</span>
						</button>
					)
				})}
			</div>
			{locked && (
				<p className="small" style={{marginTop:12}}>
					{q.explanation}
				</p>
			)}
		</div>
	)
}