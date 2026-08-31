import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminMasterclassProvider, useAdminMasterclass } from "./AdminMasterclassProvider";
import AdminMasterclassCohortsTab from "./AdminMasterclassCohortsTab";
import AdminMasterclassCurriculumTab from "./AdminMasterclassCurriculumTab";
import AdminMasterclassFinalProjectsTab from "./AdminMasterclassFinalProjectsTab";
import AdminMasterclassCertificatesTab from "./AdminMasterclassCertificatesTab";
import AdminMasterclassAnnouncementsTab from "./AdminMasterclassAnnouncementsTab";
import AdminMasterclassAttendanceTab from "./AdminMasterclassAttendanceTab";

const AdminMasterclassContent = () => {
  const { isLoading, program } = useAdminMasterclass();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Masterclass Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the Web Development Masterclass program: cohorts, curriculum, final projects,
          certificates, announcements, and attendance.
        </p>
      </section>

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading masterclass data...
        </div>
      ) : !program ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          The masterclass program is not seeded yet. Apply the Phase 9 migrations to get started.
        </div>
      ) : (
        <Tabs defaultValue="cohorts">
          <div className="overflow-x-auto">
            <TabsList>
              <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="final-projects">Final Projects</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="cohorts">
            <AdminMasterclassCohortsTab />
          </TabsContent>
          <TabsContent value="curriculum">
            <AdminMasterclassCurriculumTab />
          </TabsContent>
          <TabsContent value="final-projects">
            <AdminMasterclassFinalProjectsTab />
          </TabsContent>
          <TabsContent value="certificates">
            <AdminMasterclassCertificatesTab />
          </TabsContent>
          <TabsContent value="announcements">
            <AdminMasterclassAnnouncementsTab />
          </TabsContent>
          <TabsContent value="attendance">
            <AdminMasterclassAttendanceTab />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

const AdminMasterclassLayout = () => (
  <AdminMasterclassProvider>
    <AdminMasterclassContent />
  </AdminMasterclassProvider>
);

export default AdminMasterclassLayout;
