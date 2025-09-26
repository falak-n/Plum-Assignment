
import React from 'react'

export default function QuestionCard(props) {
  const question = props.q
  const selection = props.selection
  const onSelect = props.onSelect
  const locked = props.locked

  // Get which option was chosen and whether it’s correct or not 
  const chosenId = selection?.selectedId
  const answerIsCorrect = selection?.isCorrect

  return (
    <div className="card">
      {/* Question text */}
      <div className="title">{question.question}</div>

      {/* List of options */}
      <div className="row" style={{ flexDirection: 'column' }}>
        {question.options.map(option => {
          const isChosen = chosenId === option.id

          //it is going to  Build the className string step by step
          const optionClasses = [
            'option',
            locked && isChosen && (answerIsCorrect ? 'correct' : 'wrong'),
            locked && !isChosen ? 'disabled' : ''
          ]
            .filter(Boolean) // this  remove empty strings
            .join(' ')

          return (
            <button
              key={option.id}
              className={optionClasses}
              onClick={() => {
                if (!locked) {
                  onSelect(option.id)
                }
              }}
              disabled={locked}
            >
              <span className="kbd">{option.id.toUpperCase()}</span>
              <span>{option.text}</span>
            </button>
          )
        })}
      </div>

      {/* when locked the ans ,yhn se explanation aayega */}
      {locked && (
        <p className="small" style={{ marginTop: 12 }}>
          {question.explanation}
        </p>
      )}
    </div>
  )
}
