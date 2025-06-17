import { useEffect } from "react";

export default function usePlaceholderEffect(placeholders, setPlaceholder) {
  useEffect(() => {
    const random = placeholders[Math.floor(Math.random() * placeholders.length)];
    setPlaceholder(random);
  }, []);
}
