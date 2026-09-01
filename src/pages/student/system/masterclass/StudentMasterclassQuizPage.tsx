import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { submitMasterclassQuizAttempt, syncMasterclassEnrollmentProgress } from "@/lib/masterclass";
import type { MasterclassQuizSubmissionResult } from "@/types/masterclass";
import { useMasterclassStudent } from "./MasterclassStudentProvider";
import { useStudentMasterclassWeek } from "./StudentMasterclassWeekProvider";
import { useStudentPortal } from "../StudentPortalContext";

const StudentMasterclassQuizPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { cohort, weeks } = useMasterclassStudent();
  const { quiz, questions, attempts, isLoading, refreshWeekData } = useStudentMasterclassWeek();
  const { refresh: refreshStudentPortal } = useStudentPortal();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<MasterclassQuizSubmissionResult | null>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const handleSubmitQuiz = async () => {
    if (!quiz || !user || !cohort) return;
    setIsSubmittingQuiz(true);
    try {
      const submission = await submitMasterclassQuizAttempt(quiz.id, answers);
      setResult(submission);
      await syncMasterclassEnrollmentProgress({
        userId: user.id,
        courseId: cohort.courseId,
        cohortId: cohort.id,
        weeks,
      });
      await refreshWeekData();
      await refreshStudentPortal();
      toast({
        title: submission.passed ? "Quiz passed" : "Quiz submitted",
        description: `Score: ${submission.score}% (passing score: ${quiz.passingScore}%)`,
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">Loading quiz...</CardContent>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          No quiz published for this week yet.
        </CardContent>
      </Card>
    );
  }

  const attemptsUsed = attempts.length;
  const attemptsRemaining = Math.max(quiz.maxAttempts - attemptsUsed, 0);
  const bestScore = attempts.reduce((max, attempt) => Math.max(max, attempt.score), 0);
  const allQuestionsAnswered = questions.length > 0 && questions.every((question) => answers[question.id]);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">{quiz.title}</h2>
        <p className="text-sm text-muted-foreground">{quiz.instructions}</p>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">Passing score: {quiz.passingScore}%</Badge>
          <Badge variant="outline">Attempts remaining: {attemptsRemaining}</Badge>
          {attempts.length > 0 && <Badge variant="outline">Best score: {bestScore}%</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {attemptsRemaining === 0 ? (
          <p className="text-sm text-muted-foreground">
            You have used all {quiz.maxAttempts} attempts for this quiz.
          </p>
        ) : (
          <>
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-2">
                <p className="font-medium">
                  {index + 1}. {question.questionText}
                </p>
                <RadioGroup
                  value={answers[question.id] ?? ""}
                  onValueChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
                >
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                      <Label htmlFor={`${question.id}-${option.id}`} className="font-normal">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {result?.explanations[question.id] && (
                  <p className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                    Correct answer: {result.correctAnswers[question.id]}. {result.explanations[question.id]}
                  </p>
                )}
              </div>
            ))}

            <Button onClick={() => void handleSubmitQuiz()} disabled={!allQuestionsAnswered || isSubmittingQuiz}>
              {isSubmittingQuiz ? "Submitting..." : "Submit Quiz"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentMasterclassQuizPage;
