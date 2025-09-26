
import React, { useState } from 'react'
import { generateQuiz } from '../lib/gemini'
import RetryNotice from '../components/RetryNotice.jsx'

// default topics to choose from
const DEFAULT_TOPICS = [
  'Wellness Basics',
  'Nutrition',
  'Tech Trends',
  'JavaScript',
  'Cybersecurity',
  'Climate & Sustainability'
]

export default function TopicSelect(props) {
  const onStart = props.onStart

  // state for available topics (static here)
  const [topics] = useState(DEFAULT_TOPICS)
  // which topic the user picked
  const [selectedTopic, setSelectedTopic] = useState(topics[0])
  // are we waiting for the AI to generate the quiz?
  const [loading, setLoading] = useState(false)
  // store any error that happens while generating quiz
  const [error, setError] = useState(null)

  // called when user clicks "Start Quiz"
  const handleGenerate = async () => {
    setLoading(true) // show loading spinner / disable button
    setError(null)   // clear previous errors

    try {
      // ask AI to make a quiz for this topic
      const quiz = await generateQuiz(selectedTopic, { retries: 2 })
      // start the quiz in the parent component
      onStart(selectedTopic, quiz.questions)
    } catch (e) {
      // something went wrong, show retry message
      setError(e)
    } finally {
      setLoading(false) // done generating
    }
  }

  return (
    <div className="card">
      {/* main title */}
      {/* <div className="title">Choose a topic</div>
      <p className="subtitle">AI will generate 5 MCQs for your practice.</p> */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div className="title">Choose a topic</div>
        <p className="subtitle">AI will generate 5 MCQs for your practice.</p>
      </div>


      {/* list of topic buttons */}
      <div className="row"style={{ justifyContent: 'center' }}>
        {topics.map(t => (
          <button
            key={t}
            className={`topic ${selectedTopic === t ? 'selected' : ''}`}
            onClick={() => setSelectedTopic(t)}
          >
            {t}
          </button>
        ))}
            

      </div>

      {/* start quiz button */}
      {/* <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button className="btn" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating…' : 'Start Quiz'}
        </button>
      </div> */}
       {/* start quiz button */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <button className="btn" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating…' : 'Start Quiz'}
          </button>
        </div>


      {/* show retry notice if something went wrong */}
      {error && (
        <div style={{ marginTop: 16 }}>
          <RetryNotice message={error.message} onRetry={handleGenerate} />
        </div>
      )}
    </div>
  )
}
