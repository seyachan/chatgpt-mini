import { useEffect } from "react";

export default function useTranscriptInput(transcript, setInput) {
  useEffect(() => {
    if (transcript) {
      setInput((prev) => prev + transcript);
    }
  }, [transcript]);
}