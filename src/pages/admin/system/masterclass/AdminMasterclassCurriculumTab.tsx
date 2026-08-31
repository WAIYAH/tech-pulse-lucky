import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAdminMasterclass } from "./AdminMasterclassProvider";
import AdminMasterclassLessonsPanel from "./AdminMasterclassLessonsPanel";
import AdminMasterclassTerminologyPanel from "./AdminMasterclassTerminologyPanel";
import AdminMasterclassQuizPanel from "./AdminMasterclassQuizPanel";

const AdminMasterclassCurriculumTab = () => {
  const { weeks, program } = useAdminMasterclass();
  const [selectedWeekNumber, setSelectedWeekNumber] = useState(1);
  const week = weeks.find((row) => row.weekNumber === selectedWeekNumber);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Curriculum</h2>
          <p className="text-sm text-muted-foreground">
            Curriculum is shared across every cohort of this program &mdash; editing a week here
            updates it for the 2026 cohort and every future cohort.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {weeks.map((row) => (
              <Button
                key={row.id}
                size="sm"
                variant={row.weekNumber === selectedWeekNumber ? "default" : "outline"}
                onClick={() => setSelectedWeekNumber(row.weekNumber)}
              >
                Week {row.weekNumber}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {week && program && (
        <>
          <AdminMasterclassLessonsPanel week={week} />
          <AdminMasterclassTerminologyPanel week={week} />
          <AdminMasterclassQuizPanel week={week} />
        </>
      )}
    </div>
  );
};

export default AdminMasterclassCurriculumTab;
