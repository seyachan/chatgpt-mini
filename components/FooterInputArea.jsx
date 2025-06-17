import { useRef } from "react"; 
import ChatInputBox from "./ChatInputBox";
import InputFooterBar from "./InputFooterBar";

export default function FooterInputArea({
  input,
  setInput,
  placeholder,
  isLoading,
  startRecording,
  handleFileChange,
  sendMessage,
}) {
  const textareaRef = useRef(null); 

  return (
     <div className="flex justify-center items-center py-6">
      <div className="w-full max-w-2xl px-4">
        <ChatInputBox
          input={input}
          setInput={setInput}
          placeholder={placeholder}
          isLoading={isLoading}
          startRecording={startRecording}
          handleFileChange={handleFileChange}
          sendMessage={sendMessage}
          textareaRef={textareaRef} 
        />
        <InputFooterBar />
      </div>
    </div>
  );
}
