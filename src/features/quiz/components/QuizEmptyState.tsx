import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'

type QuizEmptyStateProps = {
  quizTitle: string
  onBack: () => void
}

export function QuizEmptyState({ quizTitle, onBack }: QuizEmptyStateProps) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-50 p-3 sm:p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{quizTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground sm:text-base">This quiz has no questions yet.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={onBack}>
            Back to Quiz Selection
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

