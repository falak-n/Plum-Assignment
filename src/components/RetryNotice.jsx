import React from 'react'

export default function RetryNotice({ message, onRetry }) {
	return (
		<div className="card">
			<div className="title">Something went wrong</div>
			<p className="small">{String(message)}</p>
			<button className="btn" onClick={onRetry}>Try again</button>
		</div>
	)
}