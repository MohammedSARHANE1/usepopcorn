export default function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

export  function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

export  function Search({ handleChange, handleClick }) {
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

export  function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
