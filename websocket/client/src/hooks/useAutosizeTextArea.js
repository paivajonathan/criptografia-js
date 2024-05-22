import { useEffect, useRef } from "react";

export default function useAutosizeTextArea(textAreaRef, value) {
  const firstUpdateRef = useRef(true);

  useEffect(() => {
    if (!textAreaRef.current) return;
        
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = `${firstUpdateRef.current ? "auto" : textAreaRef.current.scrollHeight}px`;
    
    firstUpdateRef.current = false;
  }, [textAreaRef.current, value])
}
