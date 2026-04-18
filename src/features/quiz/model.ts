import quizDataJson from '#/data/quizData.json'

export const quizData = quizDataJson

export type QuizData = typeof quizData
export type QuizKey = keyof QuizData
export type Quiz = QuizData[QuizKey]
export type Question = Quiz['questions'][number]

