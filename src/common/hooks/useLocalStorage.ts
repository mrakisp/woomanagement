import { useState } from "react";
import {
  setLocalStorageUtil,
  getLocalStorageUtil,
} from "../utils/updateLocalStorage";

// Hook
export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
  encrypted: boolean = false
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      let item;
      if (encrypted) {
        item = getLocalStorageUtil(key, true);
      } else {
        item = getLocalStorageUtil(key);
      }
      // const item = localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (encrypted) {
        setLocalStorageUtil(key, JSON.stringify(valueToStore), true);
      } else {
        setLocalStorageUtil(key, JSON.stringify(valueToStore));
      }
      // localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// import { useEffect, useState } from "react";

// export default function useLocalStorage<T>(
//   key: string,
//   initialValue: T
// ): [T, (value: T | ((val: T) => T)) => void] {
//   const valueFromStorage = localStorage.getItem(key);
//   const [value, setValue] = useState(() => {
//     let parsedSavedValue;
//     if (valueFromStorage) {
//       parsedSavedValue = JSON.parse(valueFromStorage);
//       return parsedSavedValue;
//     }

//     if (initialValue instanceof Function) return initialValue();

//     return valueFromStorage || initialValue;
//   });

//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(value));
//   }, [key, value]);

//   // useEffect(() => {
//   //   if (valueFromStorage) setValue(JSON.parse(valueFromStorage));
//   // }, [valueFromStorage]);

//   useEffect(() => {
//     if (valueFromStorage) setValue(JSON.parse(valueFromStorage));
//     const parsedSavedValue = localStorage.getItem(key);
//     if (parsedSavedValue) setValue(JSON.parse(parsedSavedValue));
//   }, [valueFromStorage]);

//   return [value, setValue];
// }
