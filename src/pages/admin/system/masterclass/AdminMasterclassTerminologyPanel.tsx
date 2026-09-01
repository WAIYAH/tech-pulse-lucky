import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  createMasterclassTerm,
  deleteMasterclassTerm,
  readMasterclassTerminology,
  updateMasterclassTerm,
} from "@/lib/masterclass";
import type { MasterclassTerm, MasterclassWeek } from "@/types/masterclass";

interface TermFormState {
  id?: string;
  term: string;
  definition: string;
  simpleExplanation: string;
  example: string;
  relatedConcept: string;
  termOrder: number;
}

const emptyForm = (nextOrder: number): TermFormState => ({
  term: "",
  definition: "",
  simpleExplanation: "",
  example: "",
  relatedConcept: "",
  termOrder: nextOrder,
});

const AdminMasterclassTerminologyPanel = ({ week }: { week: MasterclassWeek }) => {
  const { toast } = useToast();
  const [terms, setTerms] = useState<MasterclassTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<TermFormState>(emptyForm(1));
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    const rows = await readMasterclassTerminology(week.id);
    setTerms(rows);
    setForm(emptyForm(rows.length + 1));
    setIsLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week.id]);

  const startEdit = (term: MasterclassTerm) => {
    setForm({
      id: term.id,
      term: term.term,
      definition: term.definition,
      simpleExplanation: term.simpleExplanation,
      example: term.example,
      relatedConcept: term.relatedConcept,
      termOrder: term.termOrder,
    });
  };

  const resetForm = () => setForm(emptyForm(terms.length + 1));

  const saveTerm = async () => {
    if (!form.term.trim() || !form.definition.trim()) {
      toast({ title: "Missing fields", description: "Term and definition are required.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      if (form.id) {
        await updateMasterclassTerm(form.id, {
          term: form.term.trim(),
          definition: form.definition.trim(),
          simpleExplanation: form.simpleExplanation.trim(),
          example: form.example.trim(),
          relatedConcept: form.relatedConcept.trim(),
          termOrder: form.termOrder,
        });
        toast({ title: "Term updated" });
      } else {
        await createMasterclassTerm({
          weekId: week.id,
          term: form.term.trim(),
          definition: form.definition.trim(),
          simpleExplanation: form.simpleExplanation.trim(),
          example: form.example.trim(),
          relatedConcept: form.relatedConcept.trim(),
          termOrder: form.termOrder,
        });
        toast({ title: "Term created" });
      }
      resetForm();
      await load();
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const removeTerm = async (term: MasterclassTerm) => {
    if (!window.confirm(`Delete term "${term.term}"?`)) return;
    try {
      await deleteMasterclassTerm(term.id);
      toast({ title: "Term deleted" });
      await load();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Terminology &mdash; {terms.length} terms</h3>
        <p className="text-sm text-muted-foreground">Target: 50+ terms per week, expandable here over time.</p>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-5">
        <div className="max-h-[420px] space-y-2 overflow-y-auto lg:col-span-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading terminology...</p>
          ) : terms.length === 0 ? (
            <p className="text-sm text-muted-foreground">No terms yet.</p>
          ) : (
            terms.map((term) => (
              <div key={term.id} className="rounded-xl border border-border bg-background p-3">
                <p className="text-sm font-semibold">{term.term}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{term.definition}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(term)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => void removeTerm(term)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3 lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Term</Label>
              <Input value={form.term} onChange={(event) => setForm((prev) => ({ ...prev, term: event.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Order</Label>
              <Input
                type="number"
                min={1}
                value={form.termOrder}
                onChange={(event) => setForm((prev) => ({ ...prev, termOrder: Number(event.target.value) }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Definition</Label>
            <Textarea
              rows={2}
              value={form.definition}
              onChange={(event) => setForm((prev) => ({ ...prev, definition: event.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Simple Explanation</Label>
            <Textarea
              rows={2}
              value={form.simpleExplanation}
              onChange={(event) => setForm((prev) => ({ ...prev, simpleExplanation: event.target.value }))}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Example</Label>
              <Input value={form.example} onChange={(event) => setForm((prev) => ({ ...prev, example: event.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Related Concept</Label>
              <Input
                value={form.relatedConcept}
                onChange={(event) => setForm((prev) => ({ ...prev, relatedConcept: event.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="accent" onClick={() => void saveTerm()} disabled={isSaving}>
              {form.id ? (isSaving ? "Saving..." : "Save Changes") : isSaving ? "Creating..." : "Add Term"}
            </Button>
            {form.id && (
              <Button variant="outline" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminMasterclassTerminologyPanel;
