import { useState, useEffect, useRef } from 'react'
import './App.css'
import { WORD_LIST, getWordCategory } from './wordList'

const hintSequence = [
	{ type: 'category', cost: 1 },
	{ type: 'length', cost: 1 },
	{ type: 'vowelCount', cost: 1 },
	{ type: 'lastLetter', cost: 1 },
	{ type: 'firstLetter', cost: 1 },
]

const INITIAL_WORD_SCORE = 12 // Starting score for each word

function App() {
	const [currentWord, setCurrentWord] = useState('')
	const [middleLetters, setMiddleLetters] = useState('')
	const [userGuess, setUserGuess] = useState('')
	const [feedback, setFeedback] = useState('')
	const [score, setScore] = useState(0)
	const [currentWordScore, setCurrentWordScore] = useState(INITIAL_WORD_SCORE)
	const [gameStarted, setGameStarted] = useState(false)
	const [timeUntilNextHint, setTimeUntilNextHint] = useState(10)
	const [currentHintIndex, setCurrentHintIndex] = useState(0)
	const [wordsPlayed, setWordsPlayed] = useState(0)
	const [gameCompleted, setGameCompleted] = useState(false)
	const [revealedIndices, setRevealedIndices] = useState<number[]>([])
	const intervalRef = useRef<number | undefined>(undefined)
	const timeRef = useRef(10)
	const scoreIntervalRef = useRef<number | undefined>(undefined)

	const [hints, setHints] = useState<Record<string, { shown: boolean; cost: number }>>({
		category: { shown: false, cost: 1 },
		length: { shown: false, cost: 1 },
		vowelCount: { shown: false, cost: 1 },
		lastLetter: { shown: false, cost: 1 },
		firstLetter: { shown: false, cost: 1 },
	})

	// Score decay effect
	useEffect(() => {
		if (gameStarted && currentWordScore > 0) {
			if (scoreIntervalRef.current !== undefined) {
				clearInterval(scoreIntervalRef.current)
			}

			scoreIntervalRef.current = window.setInterval(() => {
				setCurrentWordScore((prev) => Math.max(0, prev - 0.1))
			}, 1000)

			return () => {
				if (scoreIntervalRef.current !== undefined) {
					clearInterval(scoreIntervalRef.current)
					scoreIntervalRef.current = undefined
				}
			}
		}
	}, [gameStarted, currentWord])

	useEffect(() => {
		// Clear any existing interval
		if (intervalRef.current !== undefined) {
			clearInterval(intervalRef.current)
			intervalRef.current = undefined
		}

		if (gameStarted && currentWord) {
			timeRef.current = timeUntilNextHint
			intervalRef.current = window.setInterval(() => {
				timeRef.current -= 1
				setTimeUntilNextHint(timeRef.current)

				if (timeRef.current <= 0) {
					if (currentHintIndex < hintSequence.length) {
						// Show next hint from the sequence
						const nextHint = hintSequence[currentHintIndex]
						setHints((prev) => ({
							...prev,
							[nextHint.type]: { ...prev[nextHint.type], shown: true },
						}))
						setCurrentHintIndex((prev) => prev + 1)
						setCurrentWordScore((prev) => Math.max(0, prev - nextHint.cost))
					} else {
						// All standard hints shown, start revealing additional letters
						const start = Math.floor((currentWord.length - 5) / 2)
						const middleIndices = Array.from({ length: 5 }, (_, i) => start + i)
						const availableIndices = Array.from({ length: currentWord.length }, (_, i) => i).filter(
							(i) =>
								i !== 0 && // not first letter
								i !== currentWord.length - 1 && // not last letter
								!middleIndices.includes(i) && // not middle letters
								!revealedIndices.includes(i) // not already revealed
						)

						if (availableIndices.length > 0) {
							const randomIndex =
								availableIndices[Math.floor(Math.random() * availableIndices.length)]
							setRevealedIndices((prev) => [...prev, randomIndex])
							setCurrentWordScore((prev) => Math.max(0, prev - 0.5)) // Small penalty for additional letters
						}
					}
					timeRef.current = 10
					setTimeUntilNextHint(10)
				}
			}, 1000)
		}

		return () => {
			if (intervalRef.current !== undefined) {
				clearInterval(intervalRef.current)
				intervalRef.current = undefined
			}
		}
	}, [gameStarted, currentHintIndex, currentWord, revealedIndices])

	const getMiddleLetters = (word: string) => {
		const start = Math.floor((word.length - 5) / 2)
		return word.slice(start, start + 5)
	}

	const countVowels = (word: string) => {
		return (word.match(/[aeiou]/gi) || []).length
	}

	const selectNewWord = () => {
		if (wordsPlayed >= 5) {
			setGameCompleted(true)
			return
		}
		const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
		setCurrentWord(word)
		setMiddleLetters(getMiddleLetters(word))
		setUserGuess('')
		setFeedback('')
		timeRef.current = 10
		setTimeUntilNextHint(10)
		setCurrentHintIndex(0)
		setCurrentWordScore(INITIAL_WORD_SCORE)
		setRevealedIndices([])
		setHints({
			category: { shown: false, cost: 1 },
			length: { shown: false, cost: 1 },
			vowelCount: { shown: false, cost: 1 },
			lastLetter: { shown: false, cost: 1 },
			firstLetter: { shown: false, cost: 1 },
		})
	}

	const handleGuess = () => {
		if (userGuess.toLowerCase() === currentWord.toLowerCase()) {
			setFeedback('Correct! 🎉')
			setScore(score + Math.max(0, currentWordScore))
			const nextWordsPlayed = wordsPlayed + 1
			setWordsPlayed(nextWordsPlayed)

			if (nextWordsPlayed >= 5) {
				setTimeout(() => setGameCompleted(true), 1500)
			} else {
				setTimeout(selectNewWord, 1500)
			}
		} else {
			setFeedback('Try again! ❌')
		}
	}

	const renderWordPattern = () => {
		const start = Math.floor((currentWord.length - 5) / 2)

		// Show full pattern with dashes when length hint is revealed
		if (hints.length.shown) {
			const pattern = Array(currentWord.length).fill('_')

			// Fill in the middle letters
			for (let i = 0; i < 5; i++) {
				pattern[start + i] = middleLetters[i]
			}

			// If first letter hint is shown, reveal it
			if (hints.firstLetter.shown) {
				pattern[0] = currentWord[0]
			}

			// If last letter hint is shown, reveal it
			if (hints.lastLetter.shown) {
				pattern[pattern.length - 1] = currentWord[currentWord.length - 1]
			}

			// Show additionally revealed letters
			revealedIndices.forEach((index) => {
				pattern[index] = currentWord[index]
			})

			return pattern.join(' ')
		}

		// Only show the middle letters centered
		const leftPadding = Array(start).fill('\u00A0').join(' ') // Use non-breaking space for padding
		return leftPadding + middleLetters
	}

	const renderHint = (type: string) => {
		if (!hints[type].shown) return null

		switch (type) {
			case 'length':
				return `Word length: ${currentWord.length} letters`
			case 'firstLetter':
				return `First letter: ${currentWord[0].toUpperCase()}`
			case 'lastLetter':
				return `Last letter: ${currentWord[currentWord.length - 1].toUpperCase()}`
			case 'vowelCount':
				return `Number of vowels: ${countVowels(currentWord)}`
			case 'category':
				return `Category: ${getWordCategory(currentWord)}`
			default:
				return null
		}
	}

	const startGame = () => {
		setGameStarted(true)
		setScore(0)
		setWordsPlayed(0)
		setGameCompleted(false)
		selectNewWord()
	}

	return (
		<div className="game-container">
			<h1>Word Guessing Game</h1>

			{!gameStarted ? (
				<div className="start-screen">
					<p>Guess the complete word using the middle 5 letters as a clue!</p>
					<p>You will play 5 words total - make each guess count!</p>
					<p className="hint-info">Score decreases over time and when hints appear:</p>
					{/* <ul className="hint-costs">
						<li>Start with {INITIAL_WORD_SCORE} points per word</li>
						<li>-0.1 points every second</li>
						<li>-0.5 points for wrong guesses</li>
						<li>Category hint: -1 point</li>
						<li>Length hint: -1 point</li>
						<li>Vowel count: -1 point</li>
						<li>Last letter: -1 point</li>
						<li>First letter: -1 point</li>
					</ul> */}
					<button onClick={startGame}>Start Game</button>
				</div>
			) : gameCompleted ? (
				<div className="game-complete">
					<h2>Game Complete!</h2>
					<p>Final Score: {score.toFixed(1)}</p>
					<button onClick={startGame}>Play Again</button>
				</div>
			) : (
				<>
					<div className="score-container">
						<div className="score">Total Score: {score.toFixed(1)}</div>
						<div className="current-score">Current Word Score: {currentWordScore.toFixed(1)}</div>
						<div className="words-remaining">Word {wordsPlayed + 1} of 5</div>
					</div>

					<div className="game-area">
						<div className="word-display">
							<div className="word-pattern">{renderWordPattern()}</div>
							{currentHintIndex < hintSequence.length && (
								<div className="next-hint">
									Next hint (
									{hintSequence[currentHintIndex].type.replace(/([A-Z])/g, ' $1').toLowerCase()}) in{' '}
									{timeUntilNextHint}s
								</div>
							)}
						</div>

						<div className="hints-display">
							{Object.entries(hints).map(
								([type, hint]) =>
									hint.shown && (
										<div key={type} className="hint">
											{renderHint(type)}
										</div>
									)
							)}
						</div>

						<div className="input-area">
							<input
								type="text"
								value={userGuess}
								onChange={(e) => setUserGuess(e.target.value)}
								placeholder="Enter your guess"
								onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
							/>
							<button onClick={handleGuess}>Submit</button>
						</div>

						{feedback && (
							<div className={`feedback ${feedback.includes('Correct') ? 'correct' : 'incorrect'}`}>
								{feedback}
							</div>
						)}
					</div>
				</>
			)}
		</div>
	)
}

export default App
