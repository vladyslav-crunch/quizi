import { createFileRoute } from '@tanstack/react-router'
import { quizData } from '#/features/quiz/model'
import { useQuizSession } from '#/features/quiz/useQuizSession'
import { QuizSelectionView } from '#/features/quiz/components/QuizSelectionView'
import { QuizEmptyState } from '#/features/quiz/components/QuizEmptyState'
import { QuizResultView } from '#/features/quiz/components/QuizResultView'
import { QuizQuestionView } from '#/features/quiz/components/QuizQuestionView'

export const Route = createFileRoute('/')({ component: QuizApp })

function QuizApp() {
  const {
    quizKeys,
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
  } = useQuizSession()

  if (!selectedQuizKey) {
    return (
      <QuizSelectionView
        quizKeys={quizKeys}
        getQuizTitle={(quizKey) => quizData[quizKey].title}
        onStartQuiz={startQuiz}
      />
    )
  }

  if (!currentQuiz) {
    return null
  }

  if (totalQuestions === 0) {
    return <QuizEmptyState quizTitle={currentQuiz.title} onBack={backToQuizSelection} />
  }

  if (isFinished) {
    return (
      <QuizResultView
        quizTitle={currentQuiz.title}
        score={score}
        totalQuestions={totalQuestions}
        onChooseAnother={backToQuizSelection}
        onRetry={restartCurrentQuiz}
      />
    )
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <QuizQuestionView
      quizTitle={currentQuiz.title}
      currentQuestion={currentQuestion}
      questionImageUrl={questionImageUrl}
      isMultiple={isMultiple}
      selectedOptions={selectedOptions}
      correctAnswers={correctAnswers}
      isShowingFeedback={isShowingFeedback}
      progressCurrent={progressCurrent}
      totalQuestions={totalQuestions}
      onOptionToggle={handleOptionToggle}
      onSubmit={handleSubmit}
      onNextQuestion={nextQuestion}
    />
  )
}