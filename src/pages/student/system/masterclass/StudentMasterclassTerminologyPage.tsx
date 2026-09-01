import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStudentMasterclassWeek } from "./StudentMasterclassWeekProvider";

const StudentMasterclassTerminologyPage = () => {
  const { terms } = useStudentMasterclassWeek();

  return (
    <Card>
      <CardHeader>
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
                  {term.relatedConcept && <p className="text-xs">Related: {term.relatedConcept}</p>}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentMasterclassTerminologyPage;
