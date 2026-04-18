import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import ThemeToggle from '#/components/ThemeToggle'
import { quizData } from '#/features/quiz/model'
import { useQuizSession } from '#/features/quiz/useQuizSession'
import { QuizSelectionView } from '#/features/quiz/components/QuizSelectionView'
import { QuizEmptyState } from '#/features/quiz/components/QuizEmptyState'
import { QuizResultView } from '#/features/quiz/components/QuizResultView'
import { QuizQuestionView } from '#/features/quiz/components/QuizQuestionView'

export const Route = createFileRoute('/')({ component: QuizApp })

function QuizLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="fixed right-3 top-3 z-20 sm:right-5 sm:top-5">
        <ThemeToggle />
      </div>
      {children}
    </div>
  )
}

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
      <QuizLayout>
        <QuizSelectionView
          quizKeys={quizKeys}
          getQuizTitle={(quizKey) => quizData[quizKey].title}
          onStartQuiz={startQuiz}
        />
      </QuizLayout>
    )
  }

  if (!currentQuiz) {
    return null
  }

  if (totalQuestions === 0) {
    return (
      <QuizLayout>
        <QuizEmptyState quizTitle={currentQuiz.title} onBack={backToQuizSelection} />
      </QuizLayout>
    )
  }

  if (isFinished) {
    return (
      <QuizLayout>
        <QuizResultView
          quizTitle={currentQuiz.title}
          score={score}
          totalQuestions={totalQuestions}
          onChooseAnother={backToQuizSelection}
          onRetry={restartCurrentQuiz}
        />
      </QuizLayout>
    )
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <QuizLayout>
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
    </QuizLayout>
  )
}