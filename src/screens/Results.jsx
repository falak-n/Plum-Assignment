
import React, { useEffect, useMemo, useState } from 'react'
import { generateFeedback } from '../lib/gemini'

export default function Results(props) {
  const topic = props.topic
  const questions = props.questions
  const answers = props.answers
  const score = props.score
  const onRestart = props.onRestart

  const totalQuestions = questions.length

  // figure out which questions the user got wrong
  const mistakes = useMemo(() => {
    return questions
      .map((q, i) => {
        const ans = answers[i]
        const correctId = q.options.find(o => o.isCorrect)?.id
        if (ans?.isCorrect) return null // skip if they got it right
        return {
          question: q.question,
          selected: ans?.selectedId ?? 'none',
          correct: correctId,
          explanation: q.explanation
        }
      })
      .filter(Boolean) // remove the nulls (correct answers)
  }, [questions, answers])

  // state for personalized feedback text
  const [feedback, setFeedback] = useState('Generating personalized feedback…')
  const [error, setError] = useState(null)

  // fetch feedback when component mounts
  useEffect(() => {
    let cancelled = false
    generateFeedback({ topic, score, total: totalQuestions, mistakes })
      .then(text => {
        if (!cancelled) setFeedback(text)
      })
      .catch(e => {
        if (!cancelled) setError(e.message)
      })
    return () => { cancelled = true } // cleanup if component unmounts
  }, [topic, score, totalQuestions, mistakes])

  return (
    <div className="card">
      {/* Main title */}
      <div className="title">Your results</div>

      {/* Score info */}
      <p className="subtitle">Score: {score} / {totalQuestions}</p>

      {/* Personalized feedback or error message */}
      <div style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
        {error ? `Could not fetch feedback: ${error}` : feedback}
      </div>

      {/* Button to restart or try another topic */}
      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={onRestart}>
          Try another topic
        </button>
      </div>
    </div>
  )
}
