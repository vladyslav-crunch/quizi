import quizDataJson from '#/data/quizData.json'

export type QuizQuestion = {
  question: string
  multipleAnswers?: boolean
  imageUrl?: string
  options: string[]
  answer: string | string[]
}

export type Quiz = {
  title: string
  questions: QuizQuestion[]
}

export type QuizData = Record<string, Quiz>

export const quizData = quizDataJson as QuizData

export type QuizKey = keyof QuizData
export type Question = QuizQuestion
