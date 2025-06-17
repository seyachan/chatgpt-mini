// hooks/useFileAttachment.js

import { useCallback } from "react";
import { formatFileMessage } from "../utils/fileMessageFormatter";

export default function useFileAttachment({
  currentId,
  attachedFile,
  setAttachedFile,
  addMessageToSession,
}) {
  const handleFileAttachment = useCallback(async () => {
    if (!attachedFile || typeof window === "undefined") return;

    const fileUrl = URL.createObjectURL(attachedFile);
    const fileMessage = formatFileMessage(attachedFile, fileUrl);

    addMessageToSession(currentId, { role: "user", content: fileMessage });
    setAttachedFile(null);
  }, [attachedFile, currentId, addMessageToSession, setAttachedFile]);

  return { handleFileAttachment };
}
