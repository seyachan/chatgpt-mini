import { useEffect } from "react";

export default function useScrollToBottom(scrollRef, dependencies = []) {
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, dependencies);
}
