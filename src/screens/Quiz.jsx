
import React, { useState } from 'react'
import QuestionCard from '../components/QuestionCard.jsx'
import ProgressBar from '../components/ProgressBar.jsx'

export default function Quiz(props) {
  const topic = props.topic
  const questions = props.questions
  const onFinish = props.onFinish
  const onQuit = props.onQuit

  // which question we’re on right now
  const [currentIndex, setCurrentIndex] = useState(0)
  // storing answers: { questionIndex: { selectedId, isCorrect, correctId } }
  const [answers, setAnswers] = useState({})
  // whether the current question is locked (so user can’t keep clicking)
  const [isLocked, setIsLocked] = useState(false)

  const totalQuestions = questions.length
  const currentQuestion = questions[currentIndex]
  const currentSelection = answers[currentIndex] || null

  // when user picks an option
  const handleSelect = (selectedId) => {
    if (isLocked) return // don’t let them change it once locked

    // figure out which option is actually correct
    const correctOption = currentQuestion.options.find(o => o.isCorrect)
    const correctId = correctOption ? correctOption.id : null

    // check if what they clicked is right
    const correct = selectedId === correctId

    // save the answer in state
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: { selectedId, isCorrect: correct, correctId }
    }))
    setIsLocked(true) // lock the question so no more changes
  }

  // go forward one question
  const goNext = () => {
    if (currentIndex < totalQuestions - 1) {
      const next = currentIndex + 1
      setCurrentIndex(next)
      // if we already answered that one, lock it
      setIsLocked(!!answers[next])
    }
  }

  // go back one question
  const goPrev = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1
      setCurrentIndex(prev)
      // same check for already-answered
      setIsLocked(!!answers[prev])
    }
  }

  // finish the whole quiz
  const finishQuiz = () => {
    // make sure we have an answer record for every question
    const allAnswers = Array.from({ length: totalQuestions }).map((_, i) =>
      answers[i] || { selectedId: null, isCorrect: false }
    )
    // count how many are correct
    const score = allAnswers.filter(a => a.isCorrect).length
    onFinish(score, allAnswers)
  }

  const questionNumber = currentIndex + 1 // just for display

  return (
    <div className="card">
      {/* big title at the top */}
      <div className="title">{topic}</div>

      {/* show which question we’re on */}
      <div className="small" style={{ margin: '6px 0 12px' }}>
        Question {questionNumber} of {totalQuestions}
      </div>

      {/* little bar that fills up as we go */}
      <ProgressBar value={questionNumber} max={totalQuestions} />

      {/* the actual question + options */}
      <div style={{ marginTop: 16 }}>
        <QuestionCard
          q={currentQuestion}
          selection={currentSelection}
          onSelect={handleSelect}
          locked={isLocked}
        />
      </div>

      {/* buttons for navigation and quitting/finishing */}
      <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn secondary"
            onClick={goPrev}
            disabled={currentIndex === 0} // can’t go back past first
          >
            Prev
          </button>
          <button
            className="btn secondary"
            onClick={goNext}
            disabled={currentIndex === totalQuestions - 1} // can’t go past last
          >
            Next
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn secondary" onClick={onQuit}>
            Quit
          </button>
          <button
            className="btn"
            onClick={finishQuiz}
            disabled={Object.keys(answers).length < totalQuestions} // need to answer all first
          >
            Finish
          </button>
        </div>
      </div>

   

    </div>
  )
}
