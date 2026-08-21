import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import type { SelectableQuizKey } from '#/features/quiz/useQuizSession'

type QuizSelectionViewProps = {
  quizOptions: {
    key: SelectableQuizKey
    title: string
    questionCount: number
  }[]
  onStartQuiz: (quizKey: SelectableQuizKey) => void
}

function formatQuestionCount(questionCount: number) {
  return String(questionCount)
}

function describeQuestionCount(questionCount: number) {
  return questionCount === 1
    ? '1 question'
    : `${questionCount} questions`
}

export function QuizSelectionView({
  quizOptions,
  onStartQuiz,
}: QuizSelectionViewProps) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-3 text-foreground sm:p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Select a Quiz</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:gap-4">
          {quizOptions.map((quizOption) => (
            <Button
              key={quizOption.key}
              variant="outline"
              className="h-auto w-full justify-start whitespace-normal wrap-break-word py-4 text-left text-base leading-snug"
              onClick={() => onStartQuiz(quizOption.key)}
            >
              <span className="flex w-full min-w-0 items-start justify-between gap-3">
                <span className="min-w-0 flex-1 whitespace-normal wrap-break-word text-left">
                  {quizOption.title}
                </span>
                <span
                  className="shrink-0 rounded-full border border-border bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground sm:text-xs"
                  title={describeQuestionCount(quizOption.questionCount)}
                  aria-label={describeQuestionCount(quizOption.questionCount)}
                >
                  {formatQuestionCount(quizOption.questionCount)}
                </span>
              </span>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
