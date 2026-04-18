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
    <div className="flex min-h-svh items-center justify-center bg-slate-50 p-3 sm:p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Select a Quiz</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:gap-4">
          {quizKeys.map((quizKey) => (
            <Button
              key={quizKey}
              variant="outline"
              className="w-full justify-start py-5 text-left text-base"
              onClick={() => onStartQuiz(quizKey)}
            >
              {getQuizTitle(quizKey)}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

