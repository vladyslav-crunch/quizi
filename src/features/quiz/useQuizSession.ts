import { useMemo, useState } from 'react'
import { quizData } from '#/features/quiz/model'
import type { Question, QuizKey } from '#/features/quiz/model'
import {
  createShuffledOptions,
  createShuffledOrder,
  getCorrectAnswers,
  isSubmissionCorrect,
} from '#/features/quiz/utils'

const forceMultipleChoiceQuizTitles = [
  'Systemy Sztucznej Inteligencji - Zestaw 1',
  'Systemy Sztucznej Inteligencji - Zestaw 2',
  'Systemy Sztucznej Inteligencji - Zestaw 3',
  'Systemy Sztucznej Inteligencji - Zestaw 4',
]

export function useQuizSession() {
  const [selectedQuizKey, setSelectedQuizKey] = useState<QuizKey | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [firstAttemptCorrectCount, setFirstAttemptCorrectCount] = useState(0)
  const [firstAttemptWrongCount, setFirstAttemptWrongCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isShowingFeedback, setIsShowingFeedback] = useState(false)
  const [questionOrder, setQuestionOrder] = useState<number[]>([])
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])

  const setOptionsForQuestion = (question: Question | undefined) => {
    setShuffledOptions(question ? createShuffledOptions(question.options) : [])
  }

  const initializeQuizProgress = (quizKey: QuizKey) => {
    const initialQuestionOrder = createShuffledOrder(
      quizData[quizKey].questions.length,
    )

    setCurrentIndex(0)
    setFirstAttemptCorrectCount(0)
    setFirstAttemptWrongCount(0)
    setIsFinished(false)
    setSelectedOptions([])
    setIsShowingFeedback(false)
    setQuestionOrder(initialQuestionOrder)
    setOptionsForQuestion(quizData[quizKey].questions[initialQuestionOrder[0]])
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
    setFirstAttemptCorrectCount(0)
    setFirstAttemptWrongCount(0)
    setIsFinished(false)
    setSelectedOptions([])
    setIsShowingFeedback(false)
    setQuestionOrder([])
    setShuffledOptions([])
    setSelectedQuizKey(null)
  }

  const currentQuiz = selectedQuizKey ? quizData[selectedQuizKey] : null
  const totalQuestions = currentQuiz?.questions.length ?? 0
  const activeQuestionIndex = questionOrder[currentIndex] ?? currentIndex
  const currentQuestion =
    currentQuiz && totalQuestions > 0
      ? (currentQuiz.questions[activeQuestionIndex] as Question | undefined)
      : undefined

  const correctAnswers = useMemo(() => {
    if (!currentQuestion) return []
    return getCorrectAnswers(currentQuestion)
  }, [currentQuestion])

  const isMultiple =
    Boolean(currentQuiz?.title && forceMultipleChoiceQuizTitles.includes(currentQuiz.title)) ||
    Boolean(
      currentQuestion &&
        'multipleAnswers' in currentQuestion &&
        currentQuestion.multipleAnswers,
    )
  const questionImageUrl =
    currentQuestion && 'imageUrl' in currentQuestion
      ? currentQuestion.imageUrl
      : undefined
  const progressCurrent = currentIndex + 1
  const progressTotal = questionOrder.length || totalQuestions

  const handleOptionToggle = (option: string) => {
    if (isShowingFeedback) return

    if (isMultiple) {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((selectedOption) => selectedOption !== option)
          : [...prev, option],
      )
      return
    }

    setSelectedOptions([option])
  }

  const handleSubmit = () => {
    setIsShowingFeedback(true)

    const isCorrect = isSubmissionCorrect(
      selectedOptions,
      correctAnswers,
      isMultiple,
    )
    const isFirstAttempt = currentIndex < totalQuestions

    if (isCorrect) {
      if (isFirstAttempt) {
        setFirstAttemptCorrectCount((prevCount) => prevCount + 1)
      }
      return
    }

    if (isFirstAttempt) {
      setFirstAttemptWrongCount((prevCount) => prevCount + 1)
    }

    // Retry incorrectly answered questions after the initial pass.
    setQuestionOrder((prevOrder) => [...prevOrder, activeQuestionIndex])
  }

  const nextQuestion = () => {
    setIsShowingFeedback(false)
    setSelectedOptions([])

    if (currentIndex + 1 < questionOrder.length) {
      const nextIndex = currentIndex + 1
      const nextQuestionIndex = questionOrder[nextIndex] ?? nextIndex

      setCurrentIndex(nextIndex)
      setOptionsForQuestion(currentQuiz?.questions[nextQuestionIndex])
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
    firstAttemptCorrectCount,
    firstAttemptWrongCount,
    isFinished,
    selectedOptions,
    isShowingFeedback,
    correctAnswers,
    isMultiple,
    questionImageUrl,
    shuffledOptions,
    progressCurrent,
    progressTotal,
    startQuiz,
    restartCurrentQuiz,
    backToQuizSelection,
    handleOptionToggle,
    handleSubmit,
    nextQuestion,
  }
}
