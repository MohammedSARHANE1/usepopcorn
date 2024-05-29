import { useEffect } from "react";
export function useKey(key,action){
 useEffect(
   function () {
     function callSearch(e) {
       if (e.code.toLowerCase() === key.toLowerCase()) {
         action();
       }
     }
     document.addEventListener("keydown", callSearch);
     return function () {
       document.removeEventListener("keydown", callSearch);
     };
   },
   [action,key]
 );

}