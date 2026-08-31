import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  createMasterclassQuiz,
  createMasterclassQuizQuestion,
  deleteMasterclassQuizQuestion,
  readMasterclassQuizForWeek,
  readMasterclassQuizQuestionsAdmin,
  updateMasterclassQuiz,
  updateMasterclassQuizQuestion,
} from "@/lib/masterclass";
import type {
  MasterclassQuestionType,
  MasterclassQuiz,
  MasterclassQuizQuestionAdmin,
  MasterclassWeek,
} from "@/types/masterclass";

const questionTypes: MasterclassQuestionType[] = ["mcq", "true_false", "scenario"];
const OPTION_IDS = ["a", "b", "c", "d"] as const;

interface QuestionFormState {
  id?: string;
  questionOrder: number;
  questionType: MasterclassQuestionType;
  questionText: string;
  optionTexts: Record<string, string>;
  correctAnswer: string;
  explanation: string;
  points: number;
}

const emptyQuestionForm = (nextOrder: number): QuestionFormState => ({
  questionOrder: nextOrder,
  questionType: "mcq",
  questionText: "",
  optionTexts: { a: "", b: "", c: "", d: "" },
  correctAnswer: "a",
  explanation: "",
  points: 1,
});

const AdminMasterclassQuizPanel = ({ week }: { week: MasterclassWeek }) => {
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<MasterclassQuiz | null>(null);
  const [questions, setQuestions] = useState<MasterclassQuizQuestionAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quizForm, setQuizForm] = useState({
    title: "",
    instructions: "",
    passingScore: 70,
    timeLimitMinutes: "" as string,
    maxAttempts: 3,
    randomizeQuestions: false,
  });
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);
  const [questionForm, setQuestionForm] = useState<QuestionFormState>(emptyQuestionForm(1));
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);

  const load = async () => {
    setIsLoading(true);
    const quizRow = await readMasterclassQuizForWeek(week.id);
    setQuiz(quizRow);
    if (quizRow) {
      setQuizForm({
        title: quizRow.title,
        instructions: quizRow.instructions,
        passingScore: quizRow.passingScore,
        timeLimitMinutes: quizRow.timeLimitMinutes ? String(quizRow.timeLimitMinutes) : "",
        maxAttempts: quizRow.maxAttempts,
        randomizeQuestions: quizRow.randomizeQuestions,
      });
      const questionRows = await readMasterclassQuizQuestionsAdmin(quizRow.id);
      setQuestions(questionRows);
      setQuestionForm(emptyQuestionForm(questionRows.length + 1));
    } else {
      setQuizForm({
        title: `Week ${week.weekNumber} Quiz`,
        instructions: "Complete all questions. You need at least 70% to pass.",
        passingScore: 70,
        timeLimitMinutes: "",
        maxAttempts: 3,
        randomizeQuestions: false,
      });
      setQuestions([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week.id]);

  const saveQuizMeta = async () => {
    setIsSavingQuiz(true);
    try {
      const input = {
        title: quizForm.title.trim(),
        instructions: quizForm.instructions.trim(),
        passingScore: quizForm.passingScore,
        timeLimitMinutes: quizForm.timeLimitMinutes ? Number(quizForm.timeLimitMinutes) : null,
        maxAttempts: quizForm.maxAttempts,
        randomizeQuestions: quizForm.randomizeQuestions,
      };
      if (quiz) {
        await updateMasterclassQuiz(quiz.id, input);
        toast({ title: "Quiz updated" });
      } else {
        await createMasterclassQuiz(week.id, input);
        toast({ title: "Quiz created" });
      }
      await load();
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingQuiz(false);
    }
  };

  const startEditQuestion = (question: MasterclassQuizQuestionAdmin) => {
    const optionTexts: Record<string, string> = { a: "", b: "", c: "", d: "" };
    question.options.forEach((option) => {
      optionTexts[option.id] = option.text;
    });
    setQuestionForm({
      id: question.id,
      questionOrder: question.questionOrder,
      questionType: question.questionType,
      questionText: question.questionText,
      optionTexts,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      points: question.points,
    });
  };

  const resetQuestionForm = () => setQuestionForm(emptyQuestionForm(questions.length + 1));

  const saveQuestion = async () => {
    if (!quiz) return;
    if (!questionForm.questionText.trim()) {
      toast({ title: "Missing question text", variant: "destructive" });
      return;
    }

    const options =
      questionForm.questionType === "true_false"
        ? [
            { id: "true", text: "True" },
            { id: "false", text: "False" },
          ]
        : OPTION_IDS.map((id) => ({ id, text: questionForm.optionTexts[id]?.trim() ?? "" })).filter(
            (option) => option.text.length > 0,
          );

    if (options.length < 2) {
      toast({ title: "Add at least two options", variant: "destructive" });
      return;
    }

    setIsSavingQuestion(true);
    try {
      const input = {
        questionOrder: questionForm.questionOrder,
        questionType: questionForm.questionType,
        questionText: questionForm.questionText.trim(),
        options,
        correctAnswer: questionForm.correctAnswer,
        explanation: questionForm.explanation.trim(),
        points: questionForm.points,
      };
      if (questionForm.id) {
        await updateMasterclassQuizQuestion(questionForm.id, input);
        toast({ title: "Question updated" });
      } else {
        await createMasterclassQuizQuestion({ quizId: quiz.id, ...input });
        toast({ title: "Question added" });
      }
      resetQuestionForm();
      await load();
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingQuestion(false);
    }
  };

  const removeQuestion = async (question: MasterclassQuizQuestionAdmin) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await deleteMasterclassQuizQuestion(question.id);
      toast({ title: "Question deleted" });
      await load();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">Loading quiz...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Quiz &mdash; Week {week.weekNumber}</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Quiz Title</Label>
            <Input value={quizForm.title} onChange={(event) => setQuizForm((prev) => ({ ...prev, title: event.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Passing Score (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={quizForm.passingScore}
              onChange={(event) => setQuizForm((prev) => ({ ...prev, passingScore: Number(event.target.value) }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Max Attempts</Label>
            <Input
              type="number"
              min={1}
              value={quizForm.maxAttempts}
              onChange={(event) => setQuizForm((prev) => ({ ...prev, maxAttempts: Number(event.target.value) }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Time Limit (minutes, optional)</Label>
            <Input
              type="number"
              min={0}
              value={quizForm.timeLimitMinutes}
              onChange={(event) => setQuizForm((prev) => ({ ...prev, timeLimitMinutes: event.target.value }))}
              placeholder="No limit"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch
              checked={quizForm.randomizeQuestions}
              onCheckedChange={(checked) => setQuizForm((prev) => ({ ...prev, randomizeQuestions: checked }))}
            />
            <Label>Randomize question order</Label>
          </div>
          <div className="sm:col-span-2 lg:col-span-4 space-y-1.5">
            <Label>Instructions</Label>
            <Textarea
              rows={2}
              value={quizForm.instructions}
              onChange={(event) => setQuizForm((prev) => ({ ...prev, instructions: event.target.value }))}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <Button onClick={() => void saveQuizMeta()} disabled={isSavingQuiz}>
              {quiz ? (isSavingQuiz ? "Saving..." : "Save Quiz Settings") : isSavingQuiz ? "Creating..." : "Create Quiz"}
            </Button>
          </div>
        </div>

        {quiz && (
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="space-y-2 lg:col-span-2">
              <p className="text-sm font-semibold">{questions.length} Questions</p>
              {questions.map((question) => (
                <div key={question.id} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="capitalize">
                      {question.questionType.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">#{question.questionOrder}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold">{question.questionText}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Correct: {question.correctAnswer}</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEditQuestion(question)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => void removeQuestion(question)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 lg:col-span-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Order</Label>
                  <Input
                    type="number"
                    min={1}
                    value={questionForm.questionOrder}
                    onChange={(event) =>
                      setQuestionForm((prev) => ({ ...prev, questionOrder: Number(event.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Select
                    value={questionForm.questionType}
                    onValueChange={(value) =>
                      setQuestionForm((prev) => ({
                        ...prev,
                        questionType: value as MasterclassQuestionType,
                        correctAnswer: value === "true_false" ? "true" : "a",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type} value={type} className="capitalize">
                          {type.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min={1}
                    value={questionForm.points}
                    onChange={(event) => setQuestionForm((prev) => ({ ...prev, points: Number(event.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Question Text</Label>
                <Textarea
                  rows={2}
                  value={questionForm.questionText}
                  onChange={(event) => setQuestionForm((prev) => ({ ...prev, questionText: event.target.value }))}
                />
              </div>

              {questionForm.questionType === "true_false" ? (
                <div className="space-y-1.5">
                  <Label>Correct Answer</Label>
                  <Select
                    value={questionForm.correctAnswer}
                    onValueChange={(value) => setQuestionForm((prev) => ({ ...prev, correctAnswer: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Options (leave blank to omit)</Label>
                  {OPTION_IDS.map((id) => (
                    <div key={id} className="flex items-center gap-2">
                      <span className="w-5 text-xs font-semibold uppercase text-muted-foreground">{id}</span>
                      <Input
                        value={questionForm.optionTexts[id] ?? ""}
                        onChange={(event) =>
                          setQuestionForm((prev) => ({
                            ...prev,
                            optionTexts: { ...prev.optionTexts, [id]: event.target.value },
                          }))
                        }
                      />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <Label>Correct Answer</Label>
                    <Select
                      value={questionForm.correctAnswer}
                      onValueChange={(value) => setQuestionForm((prev) => ({ ...prev, correctAnswer: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPTION_IDS.map((id) => (
                          <SelectItem key={id} value={id} className="uppercase">
                            {id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Explanation</Label>
                <Textarea
                  rows={2}
                  value={questionForm.explanation}
                  onChange={(event) => setQuestionForm((prev) => ({ ...prev, explanation: event.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => void saveQuestion()} disabled={isSavingQuestion}>
                  {questionForm.id
                    ? isSavingQuestion
                      ? "Saving..."
                      : "Save Changes"
                    : isSavingQuestion
                      ? "Adding..."
                      : "Add Question"}
                </Button>
                {questionForm.id && (
                  <Button variant="outline" onClick={resetQuestionForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMasterclassQuizPanel;
