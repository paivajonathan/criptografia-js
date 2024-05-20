import { useEffect, useState } from "react";

/**
 * @param {string} key
 */
export default function useSessionStorage(key) {
  const [value, setValue] = useState(() => sessionStorage.getItem(key));

  useEffect(() => {
    const handleStorageChange = () => {
      setValue(sessionStorage.getItem(key));
    };

    window.addEventListener("sessionStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("sessionStorageChange", handleStorageChange);
    };
  }, [key]);

  const setItem = (newValue) => {
    sessionStorage.setItem(key, newValue);
    window.dispatchEvent(new Event("sessionStorageChange"));
  };

  return [value, setItem];
}
