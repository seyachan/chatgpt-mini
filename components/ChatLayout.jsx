import React from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import EmptyStateBox from "./EmptyStateBox";
import FooterInputArea from "./FooterInputArea";
import AuthButton from "./AuthButton";

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
  messages,
  textareaRef,
  sendMessage,
  togglePin,
  handleFileChange,
  startRecording,
}) {
  const hasMessages = messages && messages.length > 0;

  return (
    <div className="flex h-screen relative bg-white dark:bg-gray-900">
        <div
          className={`fixed top-0 left-0 z-30 h-full w-60 bg-[#f7f7f8] dark:bg-[#1e1e20] border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar
            sessions={sessions}
            currentId={currentId}
            onSelect={setCurrentId}
            onNew={createSession}
            onDelete={deleteSession}
            onRename={updateTitle}
            onTogglePin={togglePin}
          />
        </div>

      <main className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? "ml-60" : ""}`}>
        <div className="relative flex-1 flex flex-col h-full">
          
            <div className="absolute top-4 left-4 z-20">
              <button onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/80 dark:hover:bg-gray-700/80"
                title="サイドバーを開閉"
              >
                {sidebarOpen ? '←' : '→'}
              </button>
            </div>
          
          <div className="absolute top-4 right-6 z-10">
            <AuthButton />
          </div>

          {hasMessages ? (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto pt-16">
                <div className="max-w-3xl mx-auto px-4">
                  <ChatWindow messages={messages} isLoading={isLoading} />
                </div>
              </div>
              <FooterInputArea
                input={input}
                setInput={setInput}
                placeholder={placeholder}
                isLoading={isLoading}
                sendMessage={sendMessage}
                textareaRef={textareaRef}
                handleFileChange={handleFileChange}
                startRecording={startRecording}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyStateBox
                input={input}
                setInput={setInput}
                placeholder={placeholder}
                textareaRef={textareaRef}
                sendMessage={sendMessage}
                isLoading={isLoading}
                handleFileChange={handleFileChange}
                startRecording={startRecording}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}