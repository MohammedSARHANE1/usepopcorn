import { useEffect, useState } from "react";

const KEY = "4d15de58";
export function useMovies(handleBack, search ,query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${search}`
        );

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();

        if (data.Response === "False") {
          throw new Error("Movie not found");
        }
        setMovies(data.Search);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (search) {
      handleBack();
      
      fetchMovies();
    }
  }, [search]);
  return { movies, isLoading, error };
}
