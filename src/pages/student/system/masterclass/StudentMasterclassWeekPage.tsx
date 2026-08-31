import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ExternalLink,
  ListChecks,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { routes } from "@/routes/routeConfig";
import {
  markMasterclassLessonComplete,
  readMasterclassLessonProgress,
  readMasterclassLessons,
  readMasterclassQuizAttempts,
  readMasterclassQuizForWeek,
  readMasterclassQuizQuestions,
  readMasterclassResources,
  readMasterclassTerminology,
  submitMasterclassQuizAttempt,
} from "@/lib/masterclass";
import type {
  MasterclassLesson,
  MasterclassLessonProgress,
  MasterclassQuiz,
  MasterclassQuizAttempt,
  MasterclassQuizQuestionPublic,
  MasterclassQuizSubmissionResult,
  MasterclassResource,
  MasterclassTerm,
} from "@/types/masterclass";
import { useMasterclassStudent } from "./MasterclassStudentProvider";

const StudentMasterclassWeekPage = () => {
  const { weekNumber: weekNumberParam } = useParams<{ weekNumber: string }>();
  const weekNumber = Number(weekNumberParam);
  const { user } = useAuth();
  const { toast } = useToast();
  const { program, cohort, weeks, hasAccess, isLoading: isPortalLoading } = useMasterclassStudent();

  const week = weeks.find((row) => row.weekNumber === weekNumber);

  const [lessons, setLessons] = useState<MasterclassLesson[]>([]);
  const [terms, setTerms] = useState<MasterclassTerm[]>([]);
  const [resources, setResources] = useState<MasterclassResource[]>([]);
  const [quiz, setQuiz] = useState<MasterclassQuiz | null>(null);
  const [questions, setQuestions] = useState<MasterclassQuizQuestionPublic[]>([]);
  const [attempts, setAttempts] = useState<MasterclassQuizAttempt[]>([]);
  const [lessonProgress, setLessonProgress] = useState<MasterclassLessonProgress[]>([]);
  const [isLoadingWeek, setIsLoadingWeek] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<MasterclassQuizSubmissionResult | null>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!week || !hasAccess || !user || !cohort) {
        setIsLoadingWeek(false);
        return;
      }

      setIsLoadingWeek(true);
      const [lessonRows, termRows, resourceRows, quizRow, progressRows] = await Promise.all([
        readMasterclassLessons(week.id),
        readMasterclassTerminology(week.id),
        readMasterclassResources(program?.id ?? "", week.id),
        readMasterclassQuizForWeek(week.id),
        readMasterclassLessonProgress(user.id, cohort.id),
      ]);
      if (!isMounted) return;

      setLessons(lessonRows);
      setTerms(termRows);
      setResources(resourceRows);
      setQuiz(quizRow);
      setLessonProgress(progressRows);
      setAnswers({});
      setResult(null);

      if (quizRow) {
        const [questionRows, attemptRows] = await Promise.all([
          readMasterclassQuizQuestions(quizRow.id),
          readMasterclassQuizAttempts(quizRow.id, user.id),
        ]);
        if (!isMounted) return;
        setQuestions(questionRows);
        setAttempts(attemptRows);
      } else {
        setQuestions([]);
        setAttempts([]);
      }

      setIsLoadingWeek(false);
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [week?.id, hasAccess, user?.id, cohort?.id, program?.id]);

  const toggleLesson = async (lessonId: string, completed: boolean) => {
    if (!user || !cohort) return;
    try {
      await markMasterclassLessonComplete(user.id, lessonId, cohort.id, completed);
      setLessonProgress((prev) => {
        const exists = prev.some((row) => row.lessonId === lessonId);
        if (exists) {
          return prev.map((row) => (row.lessonId === lessonId ? { ...row, completed } : row));
        }
        return [...prev, { id: `local-${lessonId}`, userId: user.id, lessonId, cohortId: cohort.id, completed }];
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || !user) return;
    setIsSubmittingQuiz(true);
    try {
      const submission = await submitMasterclassQuizAttempt(quiz.id, answers);
      setResult(submission);
      const refreshedAttempts = await readMasterclassQuizAttempts(quiz.id, user.id);
      setAttempts(refreshedAttempts);
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

  if (isPortalLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Loading masterclass details...
      </div>
    );
  }

  if (!week) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        This week could not be found.{" "}
        <Link to={routes.student.masterclass} className="text-primary underline">
          Back to Masterclass Overview
        </Link>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-xl font-bold">
          Week {week.weekNumber}: {week.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enroll and get your payment approved to unlock this week full lesson content, terminology, and quiz.
        </p>
        {program && (
          <Button asChild className="mt-4">
            <Link to={routes.public.course(program.slug)}>View Program &amp; Enroll</Link>
          </Button>
        )}
      </div>
    );
  }

  const attemptsUsed = attempts.length;
  const attemptsRemaining = quiz ? Math.max(quiz.maxAttempts - attemptsUsed, 0) : 0;
  const bestScore = attempts.reduce((max, attempt) => Math.max(max, attempt.score), 0);
  const allQuestionsAnswered = questions.length > 0 && questions.every((question) => answers[question.id]);
  const previousWeekNumber = week.weekNumber > 1 ? week.weekNumber - 1 : null;
  const nextWeekNumber = week.weekNumber < weeks.length ? week.weekNumber + 1 : null;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Week {week.weekNumber}</p>
            <h1 className="text-2xl font-bold md:text-3xl">{week.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{week.theme}</p>
          </div>
          <Badge variant="outline">{week.estimatedStudyTime}</Badge>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold">Learning Objectives</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {week.learningObjectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {week.topics.map((topic) => (
            <Badge key={topic} variant="secondary" className="font-normal">
              {topic}
            </Badge>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap justify-between gap-2">
        <Button variant="outline" size="sm" disabled={!previousWeekNumber} asChild={Boolean(previousWeekNumber)}>
          {previousWeekNumber ? (
            <Link to={routes.student.masterclassWeek(previousWeekNumber)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Week {previousWeekNumber}
            </Link>
          ) : (
            <span>
              <ChevronLeft className="mr-1 h-4 w-4" /> Week
            </span>
          )}
        </Button>
        <Button variant="outline" size="sm" disabled={!nextWeekNumber} asChild={Boolean(nextWeekNumber)}>
          {nextWeekNumber ? (
            <Link to={routes.student.masterclassWeek(nextWeekNumber)}>
              Week {nextWeekNumber} <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          ) : (
            <span>
              Week <ChevronRight className="ml-1 h-4 w-4" />
            </span>
          )}
        </Button>
      </div>

      <section>
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <BookOpen className="h-5 w-5 text-primary" /> Lessons
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingWeek ? (
              <p className="text-sm text-muted-foreground">Loading lessons...</p>
            ) : lessons.length === 0 ? (
              <p className="text-sm text-muted-foreground">No lessons published for this week yet.</p>
            ) : (
              lessons.map((lesson) => {
                const isComplete = lessonProgress.some(
                  (row) => row.lessonId === lesson.id && row.completed,
                );
                return (
                  <div key={lesson.id} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {lesson.lessonType}
                          </Badge>
                          <p className="font-semibold">{lesson.title}</p>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{lesson.content}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={isComplete ? "secondary" : "outline"}
                        onClick={() => void toggleLesson(lesson.id, !isComplete)}
                      >
                        {isComplete ? (
                          <>
                            <CheckCircle2 className="mr-1 h-4 w-4" /> Completed
                          </>
                        ) : (
                          <>
                            <Circle className="mr-1 h-4 w-4" /> Mark Complete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Terminology</h2>
            <p className="text-sm text-muted-foreground">{terms.length} terms for this week.</p>
          </CardHeader>
          <CardContent>
            {terms.length === 0 ? (
              <p className="text-sm text-muted-foreground">No terminology published yet.</p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {terms.map((term) => (
                  <AccordionItem key={term.id} value={term.id}>
                    <AccordionTrigger className="text-left">{term.term}</AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm text-muted-foreground">
                      <p>{term.definition}</p>
                      <p className="italic">{term.simpleExplanation}</p>
                      {term.example && <p>Example: {term.example}</p>}
                      {term.relatedConcept && (
                        <p className="text-xs">Related: {term.relatedConcept}</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </section>

      {quiz && (
        <section>
          <Card>
            <CardHeader>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <ListChecks className="h-5 w-5 text-primary" /> {quiz.title}
              </h2>
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
                        onValueChange={(value) =>
                          setAnswers((prev) => ({ ...prev, [question.id]: value }))
                        }
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

                  <Button
                    onClick={() => void handleSubmitQuiz()}
                    disabled={!allQuestionsAnswered || isSubmittingQuiz}
                  >
                    {isSubmittingQuiz ? "Submitting..." : "Submit Quiz"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Resources</h2>
          </CardHeader>
          <CardContent className="space-y-2">
            {resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resources for this week yet.</p>
            ) : (
              resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target={resource.url.startsWith("http") ? "_blank" : undefined}
                  rel={resource.url.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-sm hover:border-primary"
                >
                  <span>{resource.title}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StudentMasterclassWeekPage;
