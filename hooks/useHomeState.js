import { useState } from "react";

export default function useHomeState() {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState("ja");
  const [model, setModel] = useState("llama3-70b-8192");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [placeholder, setPlaceholder] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return {
    isDark, setIsDark,
    lang, setLang,
    model, setModel,
    copiedIndex, setCopiedIndex,
    placeholder, setPlaceholder,
    sidebarOpen, setSidebarOpen,
  };
}
