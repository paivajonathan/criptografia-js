import { useEffect, useRef } from "react";

/**
 * @param {HTMLTextAreaElement} current 
 * @param {string} value 
 */
export default function useAutosizeTextArea(current, value) {
  const firstUpdateRef = useRef(true);

  useEffect(() => {
    if (!current) return;
    
    const height = firstUpdateRef.current ? current.scrollHeight + 2 : current.scrollHeight;
    
    current.style.height = "0px";
    current.style.height = `${height}px`;
    
    firstUpdateRef.current = false;
  }, [current, value])
}
