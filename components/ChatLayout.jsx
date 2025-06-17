import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import EmptyStateBox from "./EmptyStateBox";
import FooterInputArea from "./FooterInputArea";

export default function ChatLayout({
  sidebarOpen,
  setSidebarOpen,
  sessions,
  currentId,
  setCurrentId,
  createSession,
  deleteSession,
  updateTitle,
  input,
  setInput,
  placeholder,
  isLoading,
  togglePin,
  tempReply,
  messages,
  textareaRef,
  handleFileChange,
  startRecording,
  sendMessage,
  scrollRef,
}) {
  const hasMessages = (messages && messages.length > 0) || (tempReply && tempReply.length > 0);
  const [showSidebarToggle, setShowSidebarToggle] = useState(false);


  console.log("🧪 ChatLayout props.messages:", messages);

  return (
    <div className="flex h-screen relative bg-white dark:bg-gray-900">
      <div
  className={`
    fixed top-0 left-0 z-40 h-full w-60
    bg-[#f7f7f8] dark:bg-[#1e1e20] border-r border-gray-200 dark:border-gray-700
    transition-transform duration-300 ease-in-out
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  `}
>
<Sidebar
  sessions={sessions}
  currentId={currentId}
  onSelect={setCurrentId}
  onNew={createSession}
  onDelete={deleteSession}
  onRename={updateTitle}
  onTogglePin={togglePin}
  onToggleSidebar={() => {
    setSidebarOpen(false); 
    setTimeout(() => {
      setShowSidebarToggle(true); 
    }, 200);
  }}
/>
</div>

      {showSidebarToggle && (
  <button
    onClick={() => {
      setSidebarOpen(true);       
      setShowSidebarToggle(false); 
    }}
    className="fixed top-4 left-4 z-50 p-1 w-7 h-7 rounded-md bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
  >
    →
  </button>
)}
      <main className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? "ml-48" : ""}`}>

        {hasMessages ? (
    <>
 
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 pt-10">
          <ChatWindow
            messages={messages}
            tempReply={tempReply}
            isLoading={isLoading}
            scrollRef={scrollRef}
          />
        </div>
      </div>

      <FooterInputArea
        input={input}
        setInput={setInput}
        placeholder={placeholder}
        isLoading={isLoading}
        startRecording={startRecording}
        handleFileChange={handleFileChange}
        sendMessage={sendMessage}
        textareaRef={textareaRef}
      />
    </>
  ) : (
    <>
      <div className="flex-1 flex items-center justify-center">
        <EmptyStateBox
          input={input}
          setInput={setInput}
          placeholder={placeholder}
          textareaRef={textareaRef}
          handleFileChange={handleFileChange}
          startRecording={startRecording}
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </>
  )}
</main>

    </div>
  );
}
