import { useState, useEffect } from 'react';
import Footer from '../../Component/Footer/footer';
import SearchBar from '../../Component/SearchBar/searchBar';
import MovieGrid from '../../Component/MovieGrid/movieGrid';
import {MovieGridSkeleton} from '../../Component/Loading/loading';
import ErrorMessage from '../../Component/ErrorMessage/errorMessage';
import { getPopularMovies, getDiscoverMovies, searchMovies, getMovieGenres } from '../../services/movieApi';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [genresList, setGenresList] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // State Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  // 1. Fetch Daftar Genre
  useEffect(() => {
    let isMounted = true;
    const fetchGenres = async () => {
      try {
        const data = await getMovieGenres();
        if (isMounted) setGenresList(data?.genres || data || []);
      } catch (err) {
        console.error('Gagal mengambil genre:', err);
      }
    };
    fetchGenres();
    return () => { isMounted = false; };
  }, []);

  // 2. Debounce Search Bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 3. Logika Utama Fetch Data Film
  // 3. Logika Utama Fetch Data Film
useEffect(() => {
  const controller = new AbortController();
  let isMounted = true;

  const fetchMoviesData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const options = { signal: controller.signal };
      let data;

      if (debouncedQuery.trim() !== '') {
        // A. Jika ada search, panggil search API
        data = await searchMovies(debouncedQuery, options);
      } else if (selectedGenre !== '' || selectedYear !== '' || sortBy !== 'popularity.desc') {
        // B. Jika ada filter, panggil fungsi Discover
        data = await getDiscoverMovies(selectedGenre, selectedYear, sortBy, options);
      } else {
        // C. Default: Popular Movies
        data = await getPopularMovies(options);
      }

      if (isMounted) {
        setMovies(data?.results || []);
      }
    } catch (err) {
      // Request lama yang dibatalkan (filter berganti cepat / unmount) — abaikan diam-diam
      if (err.name === 'AbortError') return;

      if (isMounted) {
        setError(err?.message || 'Gagal memuat data film. Silakan periksa koneksi kamu dan coba lagi.');
      }
    } finally {
      // Jangan matikan loading kalau request ini yang dibatalkan —
      // biarkan request terbaru yang mengontrol state loading
      if (isMounted && !controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  fetchMoviesData();

  return () => {
    isMounted = false;
    controller.abort(); // batalkan request lama setiap filter/search berubah
  };
}, [debouncedQuery, selectedGenre, selectedYear, sortBy, retryTrigger]);
  
  const handleSearch = (e) => {
    const value = typeof e === 'string' ? e : e?.target?.value || '';
    setSearchTerm(value);
  };

  const isSearchActive = debouncedQuery.trim() !== '' || searchTerm.trim() !== '';

  return (
    <div className="movies-page-container">
      <main className="movies-content">
        <header className="movies-header">
          <h1>Explore Movies</h1>
          <p>Find your favorite movies from TMDB.</p>
        </header>

        <section className="search-section">
          <SearchBar
            value={searchTerm}
            onSearch={handleSearch}
            placeholder="Search movie by title..."
          />
        </section>

        <section className="filter-section">
          <div className="filter-group">
            <label htmlFor="filter-genre">Genre</label>
            <select 
              id="filter-genre" 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              disabled={isSearchActive}
            >
              <option value="">All Genres</option>
              {genresList.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-year">Year</label>
            <select 
              id="filter-year" 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={isSearchActive}
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-sort">Sort By</label>
            <select 
              id="filter-sort" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              disabled={isSearchActive}
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="primary_release_date.desc">Latest Release</option>
              <option value="title.asc">Title (A-Z)</option>
            </select>
          </div>
        </section>

        <section className="movie-grid-section">
          {isLoading ? (
            <MovieGridSkeleton />
          ) : error ? (
            <ErrorMessage message={error} onRetry={() => setRetryTrigger(prev => prev + 1)} />
          ) : movies.length === 0 ? (
            <div className="empty-state">
              <p>
                {debouncedQuery
                  ? `Tidak ada film yang ditemukan untuk "${debouncedQuery}".`
                  : 'Tidak ada film yang ditemukan sesuai dengan kriteria filter.'}
              </p>
            </div>
          ) : (
            <MovieGrid movies={movies} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Movies;