export function finalizeAssistantMessage(addMessageToSession, currentId, result, setTempReply, setIsLoading) {
  addMessageToSession(currentId, {
    role: "assistant",
    content: result || "(no response)",
  });
  setTempReply("");
  setIsLoading(false);
}
