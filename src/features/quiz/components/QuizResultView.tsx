import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'

type QuizResultViewProps = {
  quizTitle: string
  score: number
  totalQuestions: number
  onChooseAnother: () => void
  onRetry: () => void
}

export function QuizResultView({ quizTitle, score, totalQuestions, onChooseAnother, onRetry }: QuizResultViewProps) {
  const scorePercent = Math.round((score / totalQuestions) * 100)

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-3 text-foreground sm:p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{quizTitle} Complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-base font-semibold sm:text-lg">
            Score: {score}/{totalQuestions}
          </p>
          <p className="text-sm text-muted-foreground sm:text-base">{scorePercent}% correct</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="w-full sm:w-auto" onClick={onChooseAnother}>
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

