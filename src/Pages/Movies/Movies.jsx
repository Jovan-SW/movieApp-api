import { useState, useEffect, useMemo } from 'react';
import Footer from '../../Component/Footer/footer';
import SearchBar from '../../Component/SearchBar/searchBar';
import MovieGrid from '../../Component/MovieGrid/movieGrid';
import { LoadingSpinner } from '../../Component/Loading/loading';
import ErrorMessage from '../../Component/ErrorMessage/errorMessage';
import { getPopularMovies, getDiscoverMovies, searchMovies, getMovieGenres } from '../../services/movieApi';

// TMDB tidak mendukung sort_by di endpoint search, jadi sorting hasil search
// dilakukan di client menggunakan comparator yang setara dengan opsi discover.
const SORT_COMPARATORS = {
  'popularity.desc': (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
  'vote_average.desc': (a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0),
  'primary_release_date.desc': (a, b) =>
    new Date(b.release_date || 0) - new Date(a.release_date || 0),
  'title.asc': (a, b) => (a.title || '').localeCompare(b.title || ''),
};

// TMDB membatasi maksimal 500 halaman meskipun total_pages di response lebih besar.
const TMDB_MAX_PAGE = 500;

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

  // State Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  const isSearchActive = debouncedQuery.trim() !== '';

  // 1. Fetch Daftar Genre
  useEffect(() => {
    const controller = new AbortController();
    const fetchGenres = async () => {
      try {
        const data = await getMovieGenres({ signal: controller.signal });
        setGenresList(data?.genres || []);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Gagal mengambil genre:', err);
      }
    };
    fetchGenres();
    return () => controller.abort();
  }, []);

  // 2. Debounce Search Bar
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 2B. Reset ke halaman 1 setiap kali kriteria pencarian/filter berubah.
  // Dipisah dari effect fetch supaya perubahan filter tidak "menumpuk"
  // dengan perubahan page dalam satu render yang sama.
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedGenre, selectedYear, sortBy]);

  // 3A. Fetch untuk mode SEARCH
  // Genre & sort tetap TIDAK memicu fetch (ditangani client-side di useMemo),
  // hanya query, year, dan page yang memicu request baru ke server.
  useEffect(() => {
    if (!isSearchActive) return; // ditangani oleh effect 3B

    const controller = new AbortController();

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchMovies(debouncedQuery, {
          params: {
            primary_release_year: selectedYear || undefined,
            page,
          },
          signal: controller.signal,
        });
        setMovies(data?.results || []);
        setTotalPages(Math.min(data?.total_pages || 1, TMDB_MAX_PAGE));
        setTotalResults(data?.total_results || 0);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err?.message || 'Gagal memuat hasil pencarian. Silakan coba lagi.');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchSearchResults();
    return () => controller.abort();
  }, [debouncedQuery, selectedYear, retryTrigger, isSearchActive, page]);

  // 3B. Fetch untuk mode DISCOVER / DEFAULT (tanpa search aktif)
  useEffect(() => {
    if (isSearchActive) return; // ditangani oleh effect 3A

    const controller = new AbortController();
    const hasFilter = selectedGenre !== '' || selectedYear !== '' || sortBy !== 'popularity.desc';

    const fetchDiscoverResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = hasFilter
          ? await getDiscoverMovies(selectedGenre, selectedYear, sortBy, {
              params: { page },
              signal: controller.signal,
            })
          : await getPopularMovies({ params: { page }, signal: controller.signal });

        setMovies(data?.results || []);
        setTotalPages(Math.min(data?.total_pages || 1, TMDB_MAX_PAGE));
        setTotalResults(data?.total_results || 0);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err?.message || 'Gagal memuat data film. Silakan periksa koneksi kamu dan coba lagi.');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchDiscoverResults();
    return () => controller.abort();
  }, [debouncedQuery, selectedGenre, selectedYear, sortBy, retryTrigger, isSearchActive, page]);

  // 4. Terapkan filter Genre & Sort di client HANYA saat mode search aktif.
  const displayedMovies = useMemo(() => {
    if (!isSearchActive) return movies;

    let result = movies;

    if (selectedGenre) {
      const genreId = Number(selectedGenre);
      result = result.filter((movie) => movie.genre_ids?.includes(genreId));
    }

    const comparator = SORT_COMPARATORS[sortBy];
    if (comparator) result = [...result].sort(comparator);

    return result;
  }, [movies, isSearchActive, selectedGenre, sortBy]);

  const handleSearch = (e) => {
    const value = typeof e === 'string' ? e : e?.target?.value || '';
    setSearchTerm(value);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilter = selectedGenre !== '' || selectedYear !== '' || sortBy !== 'popularity.desc';
  const isGenreFilteredSearch = isSearchActive && selectedGenre !== '';

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
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="primary_release_date.desc">Latest Release</option>
              <option value="title.asc">Title (A-Z)</option>
            </select>
          </div>
        </section>

        {!isLoading && !error && displayedMovies.length > 0 && (
          <p className="results-summary">
            {isGenreFilteredSearch
              ? `Menampilkan ${displayedMovies.length} film (genre difilter) dari ${movies.length} hasil di halaman ${page}`
              : `Halaman ${page} dari ${totalPages} — ${totalResults.toLocaleString('id-ID')} total hasil`}
          </p>
        )}

        <section className="movie-grid-section">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} onRetry={() => setRetryTrigger((prev) => prev + 1)} />
          ) : displayedMovies.length === 0 ? (
            <div className="empty-state">
              <p>
                {isGenreFilteredSearch
                  ? `Tidak ada film "${debouncedQuery}" di halaman ini yang cocok dengan genre pilihan. Coba halaman berikutnya.`
                  : isSearchActive
                  ? `Tidak ada film yang ditemukan untuk "${debouncedQuery}".`
                  : 'Tidak ada film yang ditemukan sesuai dengan kriteria filter.'}
              </p>
            </div>
          ) : (
            <MovieGrid movies={displayedMovies} />
          )}
        </section>

        {!isLoading && !error && totalPages > 1 && (
          <nav className="pagination-section" aria-label="Pagination">
            <button
              type="button"
              className="pagination-button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <span className="pagination-current">
              Halaman {page} / {totalPages}
            </span>

            <button
              type="button"
              className="pagination-button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </nav>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Movies;