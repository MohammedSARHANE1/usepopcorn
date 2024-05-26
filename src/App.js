import "./App.css";
import { useEffect, useState } from "react";

import { Rating } from "react-simple-star-rating";
const styleComponent = {
  display: "flex",
  gap: "100",
};
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
  const [search, setSearch] = useState("lion");
  const [UserRating, setUserRating] = useState(5);

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
  function handleWatchList(movie) {
    setWatched((watched) => [...watched, { ...movie, UserRating }]);
  }
  function handleUserRating(rating) {
    setUserRating(() => rating);
  }
  function onDeleteWatched(id){
    setWatched((watched)=>watched.filter(movie=>movie.imdbID!==id))
  }
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
            <MovieDetails
              selectedId={selectedId}
              handleBack={handleBack}
              handleWatchList={handleWatchList}
              handleUserRating={handleUserRating}
            />
          ) : (
            <Summary watched={watched} onDeleteWatched={onDeleteWatched} />
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

function Summary({ watched, UserRating, onDeleteWatched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(
    watched.map((movie) => Number(movie.UserRating))
  );
  const avgRuntime = average(
    watched.map((movie) => Number(movie.Runtime.split(" ")[0]))
  );

  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              paddingTop: "30px",
            }}
          >
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
        <ul className="list-watched">
          {watched.map((movie) => (
            <MovieWatch movie={movie} onDeleteWatched={onDeleteWatched} />
          ))}
        </ul>
      </div>
    </>
  );
}

function MovieDetails({
  selectedId,
  handleBack,
  handleWatchList,
  handleUserRating,
}) {
  const [movie, setMovie] = useState({});

  console.log(movie);
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
    <>
      <button className="btn" onClick={handleBack}>
        ⬅
      </button>
      <div className="details">
        <header>
          <img src={Poster} alt={`${Title} poster`} />
          <div>
            <h3>{Title}</h3>
            <p>{`${Released} - ${Runtime}`}</p>
            <p>{Genre}</p>
            <p>{`⭐ ${imdbRating} IMDB rating`}</p>
          </div>
        </header>
        <section>
          <div className="rating">
            <RatingComponent
              maxNumber={10}
              size={24}
              handleUserRating={handleUserRating}
            />
            <button
              className="btn-addList"
              onClick={() => {
                handleWatchList(movie);
                handleBack();
              }}
            >
              Add to my watched list
            </button>
          </div>

          <p>{Plot}</p>
          <p>{Actors}</p>
          <p>{Director}</p>
        </section>
      </div>
    </>
  );
}
function MovieWatch({ movie, onDeleteWatched }) {
  return (
    <>
      <li key={movie.Title} className="watch-list">
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <div>
          <h4>{movie.Title}</h4>

          <div
            style={{
              display: "flex",
              gap: "20px",
              paddingTop: "30px",
            }}
          >
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.UserRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.Runtime} </span>
            </p>
          </div>
        </div>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </li>
    </>
  );
}

function RatingComponent({ maxNumber = 5, handleUserRating }) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  handleUserRating(rating);

  const handleRating = (event) => {
    setRating(event);
  };

  // Handle pointer move
  const onPointerMove = (index) => {
    setTempRating(index + 1);
  };

  // Handle pointer leave
  const onPointerLeave = () => {
    setTempRating(0);
  };

  return (
    <div style={styleComponent}>
      <Rating
        onClick={handleRating}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
        iconsCount={maxNumber}
        size={24}
        emptyColor="#000"
      />

      <p>{tempRating !== 0 ? tempRating : rating || ""}</p>
    </div>
  );
}
