// hooks/usePlaceholder.js
import { useEffect } from "react";

export default function usePlaceholder(placeholders, setPlaceholder) {
  useEffect(() => {
    const random = placeholders[Math.floor(Math.random() * placeholders.length)];
    setPlaceholder(random);
  }, []);
}
