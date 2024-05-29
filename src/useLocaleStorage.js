import { useState ,useEffect} from "react";

export function useLocaleStorage(intialeValue,key){
    const [value, setValue] = useState(() => {
      const storageValue = localStorage.getItem(key);
      return storageValue ? JSON.parse(storageValue) : intialeValue;
    });
    useEffect(
      function () {
        localStorage.setItem(key, JSON.stringify(value));
      },
      [value,key]
    );
    return [value,setValue]
}