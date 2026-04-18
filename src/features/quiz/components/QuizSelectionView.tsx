import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import type { QuizKey } from '#/features/quiz/model'

type QuizSelectionViewProps = {
  quizKeys: QuizKey[]
  getQuizTitle: (quizKey: QuizKey) => string
  onStartQuiz: (quizKey: QuizKey) => void
}

export function QuizSelectionView({ quizKeys, getQuizTitle, onStartQuiz }: QuizSelectionViewProps) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-3 text-foreground sm:p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Select a Quiz</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:gap-4">
          {quizKeys.map((quizKey) => (
            <Button
              key={quizKey}
              variant="outline"
              className="h-auto w-full justify-start whitespace-normal break-words py-4 text-left text-base leading-snug"
              onClick={() => onStartQuiz(quizKey)}
            >
              {getQuizTitle(quizKey)}
            </Button>
          ))}
          <p className="pt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Created with a few prompts by <a href={"https://github.com/vladyslav-crunch"}><u>Vladyslav Tretiak</u></a>. If you want to add your own quizzes or improve something,
            feel free to message me.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

