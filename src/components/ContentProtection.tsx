import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const ALERT_COOLDOWN_MS = 1800;

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]'),
  );
};

const ContentProtection = () => {
  const { toast } = useToast();
  const lastNoticeAt = useRef(0);

  useEffect(() => {
    const showNotice = () => {
      const now = Date.now();
      if (now - lastNoticeAt.current < ALERT_COOLDOWN_MS) {
        return;
      }

      lastNoticeAt.current = now;
      toast({
        title: "Content protection",
        description: "Content protection is enabled on this platform.",
      });
    };

    const onContextMenu = (event: MouseEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();
      showNotice();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      const key = event.key.toLowerCase();
      const ctrlOrMeta = event.ctrlKey || event.metaKey;
      const isBlockedShortcut =
        key === "f12" ||
        (ctrlOrMeta && key === "u") ||
        (ctrlOrMeta && key === "s") ||
        (ctrlOrMeta && event.shiftKey && (key === "i" || key === "j"));

      if (!isBlockedShortcut) {
        return;
      }

      event.preventDefault();
      showNotice();
    };

    window.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [toast]);

  return null;
};

export default ContentProtection;
