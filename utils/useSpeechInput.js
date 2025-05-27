// ✅ utils/useSpeechInput.js
import { useState } from "react";

export default function useSpeechInput() {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const start = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("このブラウザでは音声認識がサポートされていません。");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.continuous = false;

    setIsRecording(true);

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      alert("音声認識エラーが発生しました");
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return { transcript, isRecording, start };
}
