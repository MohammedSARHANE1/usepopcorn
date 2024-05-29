import "./App.css";
import { useEffect, useRef, useState } from "react";
import { useMovies } from "./useMovies";
import { Rating } from "react-simple-star-rating";
import { useLocaleStorage } from "./useLocaleStorage";
import { useKey } from "./useKey";

const KEY = "4d15de58";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [UserRating, setUserRating] = useState(0);
  
  const [watched,setWatched]=useLocaleStorage([],"watched")
  const handleClick = () => {
    setSearch(() => query);

  };
  const handleBack = () => {
    setSelectedId(null);
    
  };
  const { movies, isLoading, error } = useMovies(handleBack, search);
   
  const handleSelected = (id) => {
    setSelectedId(() => id);
  };

  const handleChange = (e) => {
    setQuery(() => e.target.value);
  };

  function handleWatchList(movie) {
    const uniqueMovies = (watched) => {
      const movieSet = new Set();
      return watched.filter((movie) => {
        const isDuplicate = movieSet.has(movie.imdbID);
        movieSet.add(movie.imdbID);
        return !isDuplicate;
      });
    };

    setWatched((prevWatched) => {
      const updatedWatched = [...prevWatched, { ...movie, UserRating }];
      return uniqueMovies(updatedWatched); // Returning the result of uniqueMovies
    });
  }

  function handleUserRating(rating) {
    setUserRating(rating);
  }
  function onDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  
useKey("Enter", handleClick);
 
  return (
    <div className="App">
      <NavBar>
        <Logo />
        <Search
        
          setQuery={setQuery}
          handleChange={handleChange}
          handleClick={handleClick}
        />
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
              UserRating={UserRating}
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
  return (
    <div className="lader">
      <p>LOADING...</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="error">
      <span>📛</span>
      {message}
    </div>
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

function Search({ handleChange, handleClick ,setQuery}) {
  const inputRef = useRef(null);
   useKey("enter",function(){
    if(document.activeElement!==inputRef.current){
      inputRef.current.focus();
      setQuery("");
    }
     })
  
  return (
    <>
      <input
        className="search"
        type="text"
        placeholder=" Search movies..."
        onChange={handleChange}
        ref={inputRef}
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

function Summary({ watched, onDeleteWatched }) {
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
            <li key={movie.imdbID} className="watch-list">
              <MovieWatch movie={movie} />
              <div style={{ display: "grid", marginLeft: "30px" }}>
                <button
                  className="btn-delete"
                  onClick={() => onDeleteWatched(movie.imdbID)}
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function MovieDetails({
  selectedId,
  UserRating,
  handleBack,
  handleWatchList,
  handleUserRating,
}) {
  const countRef = useRef(1);
  const [movie, setMovie] = useState({});
  const countRtingDecisions = countRef.current;
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
  console.log(countRtingDecisions);
  useEffect(() => {
    if (UserRating) countRef.current++;
  }, [UserRating]);

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

  useEffect(
    function () {
      if (!Title) return;
      document.title = `movie | ${Title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },

    [Title]
  );
useKey("Escape", handleBack);
  

  return (
    <>
      <button className="btn" onClick={handleBack}>
        ⬅
      </button>
      <div className="details">
        <header>
          <img src={Poster} alt={`${Title} poster`} />
          <div className="detail">
            <h2>{Title}</h2>
            <p>{`${Released} - ${Runtime}`}</p>
            <p>{Genre}</p>
            <p>{`⭐ ${imdbRating} IMDB rating`}</p>
          </div>
        </header>
        <section>
          <div className="rating">
            <RatingComponent
              maxNumber={10}
              size={15}
              handleUserRating={handleUserRating}
            />
            {UserRating > 0 && (
              <button
                className="btn-addList"
                onClick={() => {
                  handleWatchList(movie);
                  handleBack();
                }}
              >
                Add to my watched list
              </button>
            )}
          </div>

          <div className="plot">
            <p>{Plot}</p>
            <p>{Actors}</p>
            <p>{Director}</p>
          </div>
        </section>
      </div>
    </>
  );
}
function MovieWatch({ movie }) {
  return (
    <>
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
    </>
  );
}

function RatingComponent({ maxNumber = 5, handleUserRating }) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  const handleRating = (event) => {
    setRating(event);
  };

  // Handle pointer move
  const onPointerMove = (index) => {
    setTempRating(index);
  };

  // Handle pointer leave
  const onPointerLeave = () => {
    setTempRating(0);
  };
  handleUserRating(rating);
  return (
    <div className="rating-com">
      <div>
        <Rating
          onClick={handleRating}
          onPointerLeave={onPointerLeave}
          onPointerMove={onPointerMove}
          iconsCount={maxNumber}
          size={20}
          emptyColor="#000"
        />
      </div>
      <p>{tempRating !== 0 ? tempRating : rating || ""}</p>
    </div>
  );
}
