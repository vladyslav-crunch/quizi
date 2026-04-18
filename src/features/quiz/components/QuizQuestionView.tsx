import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Progress } from '#/components/ui/progress'
import type { Question } from '#/features/quiz/model'

type QuizQuestionViewProps = {
  quizTitle: string
  currentQuestion: Question
  questionImageUrl?: string
  isMultiple: boolean
  selectedOptions: string[]
  correctAnswers: string[]
  isShowingFeedback: boolean
  progressCurrent: number
  totalQuestions: number
  onOptionToggle: (option: string) => void
  onSubmit: () => void
  onNextQuestion: () => void
}

export function QuizQuestionView({
  quizTitle,
  currentQuestion,
  questionImageUrl,
  isMultiple,
  selectedOptions,
  correctAnswers,
  isShowingFeedback,
  progressCurrent,
  totalQuestions,
  onOptionToggle,
  onSubmit,
  onNextQuestion,
}: QuizQuestionViewProps) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-50 p-3 sm:p-4">
      <Card className="w-full max-w-xl shadow-xl">
        <CardHeader>
          <div className="mb-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground sm:text-xs">
            <span>{quizTitle}</span>
            {isMultiple && (
              <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 sm:text-xs">
                Multiple Choice
              </span>
            )}
          </div>
          <Progress value={(progressCurrent / totalQuestions) * 100} className="h-1.5" />
          <div className="pt-2 text-right text-[11px] font-medium text-muted-foreground sm:text-xs">
            {progressCurrent}/{totalQuestions}
          </div>
          <CardTitle className="pt-3 text-lg leading-snug sm:pt-4 sm:text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-3">
          {questionImageUrl && (
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              <img src={questionImageUrl} alt={currentQuestion.question} className="h-auto w-full object-cover" loading="lazy" />
            </div>
          )}
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptions.includes(option)
            const isCorrect = correctAnswers.includes(option)

            let buttonClassName = 'h-auto min-h-14 justify-start border-2 px-4 py-3 text-left transition-all sm:px-6 sm:py-4 '

            if (isShowingFeedback) {
              if (isCorrect) buttonClassName += 'border-green-500 bg-green-50'
              else if (isSelected) buttonClassName += 'border-red-500 bg-red-50'
            } else if (isSelected) {
              buttonClassName += 'border-primary bg-primary/5'
            }

            return (
              <Button
                key={idx}
                variant="outline"
                className={`${buttonClassName} min-w-0`}
                disabled={isShowingFeedback}
                onClick={() => onOptionToggle(option)}
              >
                <div className="flex w-full min-w-0 items-start gap-2 sm:items-center sm:gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border ${
                      isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  <span className="min-w-0 flex-1 whitespace-normal break-words text-sm leading-snug sm:text-base">
                    {option}
                  </span>
                  {isShowingFeedback && isCorrect && <CheckCircle2 className="text-green-600" />}
                  {isShowingFeedback && isSelected && !isCorrect && <XCircle className="text-red-600" />}
                </div>
              </Button>
            )
          })}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end">
          {!isShowingFeedback ? (
            <Button className="w-full sm:w-auto" onClick={onSubmit} disabled={selectedOptions.length === 0}>
              Check Answer
            </Button>
          ) : (
            <Button onClick={onNextQuestion} className="w-full gap-2 sm:w-auto">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

