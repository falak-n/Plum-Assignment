

import React from 'react'

export default function ProgressBar(props) {
  // Take the value and max from props
  const currentValue = props.value
  const maximumValue = props.max || 1 // avoid dividing by 0

  // Calculate the percentage of progress
  const percentage = Math.round((currentValue / maximumValue) * 100)

  return (
    <div
      className="progress"
      aria-valuemin="0"
      aria-valuemax={maximumValue}
      aria-valuenow={currentValue}
    >
      {/* The inner bar shows how much progress is made */}
      <div
        className="bar"
        style={{ width: percentage + '%' }}
      />
    </div>
  )
}
