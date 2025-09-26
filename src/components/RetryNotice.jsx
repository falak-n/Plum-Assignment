
import React from 'react'

export default function RetryNotice(props) {
  // Get the text to show and the function to run on click
  const errorMessage = String(props.message)
  const handleRetry = props.onRetry

  return (
    <div className="card">
      {/* Heading */}
      <div className="title">Something went wrong</div>

      {/* Err message */}
      <p className="small">{errorMessage}</p>

      {/* Retry button */}
      <button className="btn" onClick={handleRetry}>
        Try again
      </button>
    </div>
  )
}
