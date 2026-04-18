import type { Question } from '#/features/quiz/model'

export function createShuffledOrder(total: number) {
  const order = Array.from({ length: total }, (_, index) => index)

  // Fisher-Yates shuffle gives each attempt a random question order.
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }

  return order
}

export function getCorrectAnswers(question: Question) {
  return Array.isArray(question.answer) ? question.answer : [question.answer]
}

export function isSubmissionCorrect(selectedOptions: string[], correctAnswers: string[], isMultiple: boolean) {
  if (!isMultiple) {
    return selectedOptions[0] === correctAnswers[0]
  }

  return (
    selectedOptions.length === correctAnswers.length &&
    selectedOptions.every((selectedOption) => correctAnswers.includes(selectedOption))
  )
}

