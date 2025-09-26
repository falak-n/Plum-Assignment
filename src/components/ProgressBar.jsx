import React from 'react'

export default function ProgressBar({ value, max }) {
	const pct = Math.round((value / Math.max(max, 1)) * 100)
	return (
		<div className="progress" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
			<div className="bar" style={{ width: `${pct}%` }} />
		</div>
	)
}