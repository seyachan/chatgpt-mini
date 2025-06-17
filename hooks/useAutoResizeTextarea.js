// hooks/useAutoResizeTextarea.js
import { useEffect } from "react";

export default function useAutoResizeTextarea(ref, value) {
  useEffect(() => {
    if (!ref.current) return;
    const textarea = ref.current;
    textarea.style.height = "auto"; 
    textarea.style.height = `${textarea.scrollHeight}px`; 
  }, [ref, value]);
}
