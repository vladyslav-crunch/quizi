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

const random40QuizKey = 'random-40-from-si-sets'
const random40QuizTitle = 'Systemy Sztucznej Inteligencji - 40 losowych pytań'

export type SelectableQuizKey = QuizKey | typeof random40QuizKey

type QuizOption = {
  key: SelectableQuizKey
  title: string
}

function getRandomQuestionsFromSet(quizTitle: (typeof forceMultipleChoiceQuizTitles)[number]) {
  const questions = quizData[quizTitle].questions
  const shuffledOrder = createShuffledOrder(questions.length)

  return shuffledOrder
    .slice(0, Math.min(10, questions.length))
    .map((questionIndex) => questions[questionIndex])
}

function getRandomFortyQuestions() {
  return forceMultipleChoiceQuizTitles.flatMap((quizTitle) =>
    getRandomQuestionsFromSet(quizTitle),
  )
}

function createQuizForKey(quizKey: SelectableQuizKey) {
  if (quizKey === random40QuizKey) {
    return {
      title: random40QuizTitle,
      questions: getRandomFortyQuestions(),
    }
  }

  return quizData[quizKey]
}

export function useQuizSession() {
  const [selectedQuizKey, setSelectedQuizKey] = useState<SelectableQuizKey | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<ReturnType<typeof createQuizForKey> | null>(null)
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

  const initializeQuizProgress = (quizKey: SelectableQuizKey) => {
    const quiz = createQuizForKey(quizKey)
    const initialQuestionOrder = createShuffledOrder(quiz.questions.length)

    setSelectedQuiz(quiz)
    setCurrentIndex(0)
    setFirstAttemptCorrectCount(0)
    setFirstAttemptWrongCount(0)
    setIsFinished(false)
    setSelectedOptions([])
    setIsShowingFeedback(false)
    setQuestionOrder(initialQuestionOrder)
    setOptionsForQuestion(quiz.questions[initialQuestionOrder[0]])
  }

  const startQuiz = (quizKey: SelectableQuizKey) => {
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
    setSelectedQuiz(null)
  }

  const currentQuiz = selectedQuiz
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
    Boolean(
      currentQuiz?.title &&
      forceMultipleChoiceQuizTitles.includes(currentQuiz.title),
    ) ||
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
    quizOptions: [
      ...Object.keys(quizData).map((quizKey) => ({
        key: quizKey,
        title: quizData[quizKey].title,
      })),
      {
        key: random40QuizKey,
        title: random40QuizTitle,
      },
    ] satisfies QuizOption[],
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
