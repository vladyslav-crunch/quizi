import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Button } from '#/components/ui/button'

type QuizResultViewProps = {
  quizTitle: string
  firstAttemptCorrectCount: number
  firstAttemptWrongCount: number
  totalQuestions: number
  onChooseAnother: () => void
  onRetry: () => void
}

export function QuizResultView({
  quizTitle,
  firstAttemptCorrectCount,
  firstAttemptWrongCount,
  totalQuestions,
  onChooseAnother,
  onRetry,
}: QuizResultViewProps) {
  const scorePercent =
    totalQuestions > 0
      ? Math.round((firstAttemptCorrectCount / totalQuestions) * 100)
      : 0

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-3 text-foreground sm:p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            {quizTitle} Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-base font-semibold sm:text-lg">
            First-try correct: {firstAttemptCorrectCount}/{totalQuestions}
          </p>
          <p className="text-sm text-muted-foreground sm:text-base">
            {scorePercent}% correct on the first attempt
          </p>
          <p className="text-sm text-muted-foreground sm:text-base">
            Wrong on first try: {firstAttemptWrongCount}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onChooseAnother}
          >
            Choose Another Quiz
          </Button>
          <Button className="w-full sm:w-auto" onClick={onRetry}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
