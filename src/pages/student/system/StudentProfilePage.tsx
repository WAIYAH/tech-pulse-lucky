import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AvatarUpload from "@/components/student/AvatarUpload";
import {
  readStudentProfileState,
  saveStudentProfileState,
  type StudentProfileState,
} from "@/lib/student/studentPortalState";
import { useStudentPortal } from "./StudentPortalContext";

const StudentProfilePage = () => {
  const { user } = useStudentPortal();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);
  const [profile, setProfile] = useState<StudentProfileState>(() =>
    user
      ? readStudentProfileState(user.id)
      : {
          jobTitle: "",
          organization: "",
          country: "",
          timezone: "",
          bio: "",
          learningGoal: "",
          linkedinUrl: "",
          githubUrl: "",
        },
  );

  if (!user) return null;

  const saveProfile = () => {
    saveStudentProfileState(user.id, profile);
    toast({
      title: "Profile saved",
      description: "Your student profile preferences were saved.",
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold md:text-3xl">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your learner profile information and career context.
        </p>
      </section>

      <section>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Profile Picture</h2>
          </CardHeader>
          <CardContent>
            <AvatarUpload
              userId={user.id}
              fullName={user.fullName}
              email={user.email}
              avatarUrl={avatarUrl}
              onUploaded={setAvatarUrl}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Learner Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={profile.jobTitle}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, jobTitle: event.target.value }))
                  }
                  placeholder="e.g. Frontend Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={profile.organization}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, organization: event.target.value }))
                  }
                  placeholder="Company or school"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={profile.country}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, country: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={profile.timezone}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, timezone: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningGoal">Learning Goal</Label>
              <Input
                id="learningGoal"
                value={profile.learningGoal}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, learningGoal: event.target.value }))
                }
                placeholder="What are you trying to achieve this quarter?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                value={profile.bio}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, bio: event.target.value }))
                }
                placeholder="Tell us about your current role and goals."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={profile.linkedinUrl}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, linkedinUrl: event.target.value }))
                  }
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  value={profile.githubUrl}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, githubUrl: event.target.value }))
                  }
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="accent" onClick={saveProfile} className="w-full sm:w-auto">
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Account Snapshot</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="font-medium">Full Name</p>
              <p className="text-muted-foreground">{user.fullName}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="font-medium">Email</p>
              <p className="break-all text-muted-foreground">{user.email}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="font-medium">Phone</p>
              <p className="break-all text-muted-foreground">{user.phone || "Not provided"}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="font-medium">Role</p>
              <Badge variant="secondary">{user.role}</Badge>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="font-medium">Joined</p>
              <p className="text-muted-foreground">
                {new Date(user.dateJoined).toLocaleDateString("en-KE")}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default StudentProfilePage;
