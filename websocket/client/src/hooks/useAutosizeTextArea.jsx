import { useEffect, useRef } from "react";

/**
 * @param {HTMLTextAreaElement} current 
 * @param {string} value 
 */
export default function useAutosizeTextArea(current, value) {
  const firstUpdateRef = useRef(true);

  useEffect(() => {
    if (!current) return;
        
    current.style.height = "auto";
    current.style.height = `${firstUpdateRef.current ? current.scrollHeight + 2 : current.scrollHeight}px`;
    
    firstUpdateRef.current = false;
  }, [current, value])
}
