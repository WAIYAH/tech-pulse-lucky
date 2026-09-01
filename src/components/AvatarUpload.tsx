import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const getInitials = (name?: string, email?: string): string => {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
};

interface AvatarUploadProps {
  userId: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  onUploaded: (url: string) => void;
}

const AvatarUpload = ({ userId, fullName, email, avatarUrl, onUploaded }: AvatarUploadProps) => {
  const { authMode } = useAuth();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(avatarUrl);
  const [isUploading, setIsUploading] = useState(false);

  const canUpload = authMode === "supabase";

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please choose a JPEG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      toast({
        title: "Image too large",
        description: "Please choose an image under 3MB.",
        variant: "destructive",
      });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/avatar.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, cacheControl: "3600", contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (profileError) throw profileError;

      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (authUpdateError) throw authUpdateError;

      setPreviewUrl(publicUrl);
      onUploaded(publicUrl);
      toast({ title: "Profile photo updated" });
    } catch (error) {
      setPreviewUrl(avatarUrl);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="h-20 w-20 border-2 border-accent/50 shadow-glow">
          <AvatarImage src={previewUrl} alt="" />
          <AvatarFallback className="bg-gradient-primary text-xl font-semibold text-primary-foreground">
            {getInitials(fullName, email)}
          </AvatarFallback>
        </Avatar>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileChange}
          className="sr-only"
          disabled={!canUpload || isUploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canUpload || isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="mr-2 h-4 w-4" />
          {avatarUrl ? "Change photo" : "Upload photo"}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          {canUpload
            ? "JPEG, PNG, WebP, or GIF. Max 3MB."
            : "Photo uploads need a live account — not available in local demo mode."}
        </p>
      </div>
    </div>
  );
};

export default AvatarUpload;
