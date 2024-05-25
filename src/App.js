import "./App.css";
import { useEffect, useState } from "react";
import { RatingComponent } from "./RatingComponent";

const KEY = "4d15de58";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
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
        console.log(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (search) {
      fetchMovies();
    }
  }, [search]);

  const handleSelected = (id) => {
    setSelectedId(id);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClick = () => {
    setSearch(query);
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  return (
    <div className="App">
      <NavBar>
        <Logo />
        <Search handleChange={handleChange} handleClick={handleClick} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {error && <ErrorMessage message={error} />}
          {isLoading && !error && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} handleSelected={handleSelected} />
          )}
        </Box>
        <Box>
            {selectedId ? (
              <MovieDetails selectedId={selectedId} handleBack={handleBack} />
            ) : (
              <Summary watched={watched} />
            )}
          
        </Box>
      </Main>
    </div>
  );
}

function Loader() {
  return <p>LOADING...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p>
      <span>📛</span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ handleChange, handleClick }) {
  return (
    <>
      <input
        className="search"
        type="text"
        placeholder=" Search movies..."
        onChange={handleChange}
      />
      <button onClick={handleClick}>🔎</button>
    </>
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      {isOpen && <>{children}</>}
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
    </div>
  );
}

function MovieList({ movies, handleSelected }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => handleSelected(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <div style={{ padding: "10px" }}>
            <h3 className="title">{movie.Title}</h3>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(1)} min</span>
        </p>
      </div>
    </div>
  );
}

function MovieDetails({ selectedId, handleBack }) {
  const [movie, setMovie] = useState({});

  useEffect(() => {
    async function fetchMovieDetails() {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
    }
    fetchMovieDetails();
  }, [selectedId]);

  const {
    Poster,
    Title,
    Released,
    Runtime,
    Genre,
    imdbRating,
    Plot,
    Actors,
    Director,
  } = movie;

  return (
    <div>
      <button className="btn-toggle" onClick={handleBack}>
        ⬅
      </button>
      <header>
        <img src={Poster} alt={`${Title} poster`} />
        <div>
          <h2>{Title}</h2>
          <p>{`${Released} - ${Runtime}`}</p>
          <p>{`⭐ ${imdbRating} IMDB rating`}</p>
        </div>
      </header>
      <section>
        <RatingComponent maxNumber={10} size={24} />
        <p>{Plot}</p>
        <p>{Actors}</p>
        <p>{Director}</p>
      </section>
    </div>
  );
}


