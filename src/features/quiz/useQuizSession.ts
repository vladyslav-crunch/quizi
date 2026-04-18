import { useMemo, useState } from 'react'
import { quizData } from '#/features/quiz/model'
import type { Question, QuizKey } from '#/features/quiz/model'
import { createShuffledOrder, getCorrectAnswers, isSubmissionCorrect } from '#/features/quiz/utils'

export function useQuizSession() {
  const [selectedQuizKey, setSelectedQuizKey] = useState<QuizKey | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isShowingFeedback, setIsShowingFeedback] = useState(false)
  const [questionOrder, setQuestionOrder] = useState<number[]>([])

  const initializeQuizProgress = (quizKey: QuizKey) => {
    setCurrentIndex(0)
    setScore(0)
    setIsFinished(false)
    setSelectedOptions([])
    setIsShowingFeedback(false)
    setQuestionOrder(createShuffledOrder(quizData[quizKey].questions.length))
  }

  const startQuiz = (quizKey: QuizKey) => {
    setSelectedQuizKey(quizKey)
    initializeQuizProgress(quizKey)
  }

  const restartCurrentQuiz = () => {
    if (!selectedQuizKey) return
    initializeQuizProgress(selectedQuizKey)
  }

  const backToQuizSelection = () => {
    setCurrentIndex(0)
    setScore(0)
    setIsFinished(false)
    setSelectedOptions([])
    setIsShowingFeedback(false)
    setQuestionOrder([])
    setSelectedQuizKey(null)
  }

  const currentQuiz = selectedQuizKey ? quizData[selectedQuizKey] : null
  const totalQuestions = currentQuiz?.questions.length ?? 0
  const activeQuestionIndex = questionOrder[currentIndex] ?? currentIndex
  const currentQuestion =
    currentQuiz && totalQuestions > 0 ? (currentQuiz.questions[activeQuestionIndex] as Question | undefined) : undefined

  const correctAnswers = useMemo(() => {
    if (!currentQuestion) return []
    return getCorrectAnswers(currentQuestion)
  }, [currentQuestion])

  const isMultiple = Boolean(currentQuestion && 'multipleAnswers' in currentQuestion && currentQuestion.multipleAnswers)
  const questionImageUrl = currentQuestion && 'imageUrl' in currentQuestion ? currentQuestion.imageUrl : undefined
  const progressCurrent = Math.min(score, totalQuestions)

  const handleOptionToggle = (option: string) => {
    if (isShowingFeedback) return

    if (isMultiple) {
      setSelectedOptions((prev) =>
        prev.includes(option) ? prev.filter((selectedOption) => selectedOption !== option) : [...prev, option],
      )
      return
    }

    setSelectedOptions([option])
  }

  const handleSubmit = () => {
    setIsShowingFeedback(true)

    const isCorrect = isSubmissionCorrect(selectedOptions, correctAnswers, isMultiple)
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1)
      return
    }

    // Retry incorrectly answered questions after the initial pass.
    setQuestionOrder((prevOrder) => [...prevOrder, activeQuestionIndex])
  }

  const nextQuestion = () => {
    setIsShowingFeedback(false)
    setSelectedOptions([])

    if (currentIndex + 1 < questionOrder.length) {
      setCurrentIndex((prev) => prev + 1)
      return
    }

    setIsFinished(true)
  }

  return {
    quizKeys: Object.keys(quizData) as QuizKey[],
    selectedQuizKey,
    currentQuiz,
    currentQuestion,
    totalQuestions,
    score,
    isFinished,
    selectedOptions,
    isShowingFeedback,
    correctAnswers,
    isMultiple,
    questionImageUrl,
    progressCurrent,
    startQuiz,
    restartCurrentQuiz,
    backToQuizSelection,
    handleOptionToggle,
    handleSubmit,
    nextQuestion,
  }
}


