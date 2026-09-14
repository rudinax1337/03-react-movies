import { useState, useEffect } from "react";
import type { Movie } from "./types/movies";
import SearchBar from "./components/SearchBar/SearchBar";
import MovieGrid from "./components/MovieGrid/MovieGrid";
import MovieModal from "./components/MovieModal/MovieModal";
import toast from "react-hot-toast";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=uk-UA`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setMovies(data.results || []);

      if (data.results.length === 0) {
        toast.error("Фільми не знайдені");
      } else {
        toast.success(`Знайдено ${data.results.length} фільмів`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Помилка при пошуку фільмів");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 Кінопошук</h1>
        <SearchBar onSearch={searchMovies} />
      </header>

      <main className="app-main">
        {loading ? (
          <div className="loading">Завантаження...</div>
        ) : movies.length > 0 ? (
          <MovieGrid movies={movies} onMovieClick={setSelectedMovie} />
        ) : (
          <div className="empty-state">Введіть назву фільму для пошуку</div>
        )}
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}

export default App;
