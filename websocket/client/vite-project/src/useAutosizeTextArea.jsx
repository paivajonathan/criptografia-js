import { useEffect } from "react";

/**
 * @param {HTMLTextAreaElement} current 
 * @param {string} value 
 */
export default function useAutosizeTextArea(current, value) {
  useEffect(() => {
    if (!current) return;
    current.style.height = "0px";
    current.style.height = `${current.scrollHeight}px`;
  }, [current, value])
}
