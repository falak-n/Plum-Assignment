import React, { useState } from 'react'
import TopicSelect from './screens/TopicSelect.jsx'
import Quiz from './screens/Quiz.jsx'
import Results from './screens/Results.jsx'

export default function App() {
	const [stage, setStage] = useState('topic') // 'topic' | 'quiz' | 'results'
	const [topic, setTopic] = useState(null)
	const [questions, setQuestions] = useState([])
	const [answers, setAnswers] = useState([]) // {questionIndex, selectedId, isCorrect}
	const [score, setScore] = useState(0)

	const reset = () => {
		setStage('topic')
		setTopic(null)
		setQuestions([])
		setAnswers([])
		setScore(0)
	}

	const startQuiz = (selectedTopic, generatedQuestions) => {
		setTopic(selectedTopic)
		setQuestions(generatedQuestions)
		setStage('quiz')
	}

	const finishQuiz = (finalScore, collectedAnswers) => {
		setScore(finalScore)
		setAnswers(collectedAnswers)
		setStage('results')
	}

	return (
		<div className="container">
			{stage === 'topic' && <TopicSelect onStart={startQuiz} />}
			{stage === 'quiz' && (
				<Quiz
					topic={topic}
					questions={questions}
					onFinish={finishQuiz}
					onQuit={reset}
				/>
			)}
			{stage === 'results' && (
				<Results
					topic={topic}
					questions={questions}
					answers={answers}
					score={score}
					onRestart={reset}
				/>
			)}
		</div>
	)
}