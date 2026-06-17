import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import type { SelectableQuizKey } from '#/features/quiz/useQuizSession'

type QuizSelectionViewProps = {
  quizOptions: {
    key: SelectableQuizKey
    title: string
  }[]
  onStartQuiz: (quizKey: SelectableQuizKey) => void
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
              {quizOption.title}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
