import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import ThemeToggle from '#/components/ThemeToggle'
import { useQuizSession } from '#/features/quiz/useQuizSession'
import { QuizSelectionView } from '#/features/quiz/components/QuizSelectionView'
import { QuizEmptyState } from '#/features/quiz/components/QuizEmptyState'
import { QuizResultView } from '#/features/quiz/components/QuizResultView'
import { QuizQuestionView } from '#/features/quiz/components/QuizQuestionView'

export const Route = createFileRoute('/')({ component: QuizApp })

type QuizLayoutProps = {
  children: ReactNode
  showBackButton?: boolean
  onBack?: () => void
}

function QuizLayout({
  children,
  showBackButton = false,
  onBack,
}: QuizLayoutProps) {
  return (
    <div className="relative">
      <div className="fixed left-3 top-3 z-20 sm:left-5 sm:top-5">
        {showBackButton && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-accent"
            aria-label="Go back to quiz selection"
            title="Back"
          >
            Back
          </button>
        )}
      </div>
      <div className="fixed right-3 top-3 z-20 sm:right-5 sm:top-5">
        <ThemeToggle />
      </div>
      {children}
    </div>
  )
}

function QuizApp() {
  const {
    quizOptions,
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
  } = useQuizSession()

  if (!selectedQuizKey) {
    return (
      <QuizLayout>
        <QuizSelectionView quizOptions={quizOptions} onStartQuiz={startQuiz} />
      </QuizLayout>
    )
  }

  if (!currentQuiz) {
    return null
  }

  if (totalQuestions === 0) {
    return (
      <QuizLayout showBackButton onBack={backToQuizSelection}>
        <QuizEmptyState
          quizTitle={currentQuiz.title}
          onBack={backToQuizSelection}
        />
      </QuizLayout>
    )
  }

  if (isFinished) {
    return (
      <QuizLayout showBackButton onBack={backToQuizSelection}>
        <QuizResultView
          quizTitle={currentQuiz.title}
          firstAttemptCorrectCount={firstAttemptCorrectCount}
          firstAttemptWrongCount={firstAttemptWrongCount}
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
    <QuizLayout showBackButton onBack={backToQuizSelection}>
      <QuizQuestionView
        quizTitle={currentQuiz.title}
        currentQuestion={currentQuestion}
        options={shuffledOptions}
        questionImageUrl={questionImageUrl}
        isMultiple={isMultiple}
        selectedOptions={selectedOptions}
        correctAnswers={correctAnswers}
        isShowingFeedback={isShowingFeedback}
        progressCurrent={progressCurrent}
        progressTotal={progressTotal}
        onOptionToggle={handleOptionToggle}
        onSubmit={handleSubmit}
        onNextQuestion={nextQuestion}
      />
    </QuizLayout>
  )
}
