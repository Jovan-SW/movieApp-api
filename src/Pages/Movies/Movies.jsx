import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../../Component/Footer/footer';
import SearchBar from '../../Component/SearchBar/searchBar';
import MovieGrid from '../../Component/MovieGrid/movieGrid';
import { LoadingSpinner } from '../../Component/Loading/loading';
import ErrorMessage from '../../Component/ErrorMessage/errorMessage';
import { getPopularMovies, getDiscoverMovies, searchMovies, getMovieGenres } from '../../services/movieApi';

const SORT_COMPARATORS = {
  'popularity.desc': (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
  'vote_average.desc': (a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0),
  'primary_release_date.desc': (a, b) =>
    new Date(b.release_date || 0) - new Date(a.release_date || 0),
  'title.asc': (a, b) => (a.title || '').localeCompare(b.title || ''),
};

const DEFAULT_SORT = 'popularity.desc';
const TMDB_MAX_PAGE = 500;

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- FILTER: tetap sumber kebenarannya dari URL → bertahan saat refresh
  const selectedGenre = searchParams.get('genre') || '';
  const selectedYear = searchParams.get('year') || '';
  const sortBy = searchParams.get('sort') || DEFAULT_SORT;
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  // --- TANGKAP URL PARAMETER SEARCH ---
  const urlSearchQuery = searchParams.get('search') || '';

  // --- SEARCH: Gunakan URL parameter sebagai nilai awal ---
  const [searchTerm, setSearchTerm] = useState(urlSearchQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlSearchQuery);

  const isSearchActive = debouncedQuery.trim() !== '';
  
  // --- Local state ---
  const [movies, setMovies] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  // Helper terpusat untuk update query params secara immutable.
  // resetPage: hapus param page (dipakai saat filter berubah, bukan pagination).
  // replace: true → tidak menambah history entry baru (dipakai untuk debounce ketik).
  const updateParams = useCallback((updates, { resetPage = false } = {}) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      if (resetPage) next.delete('page');
      return next;
    });
  }, [setSearchParams]);

  // Sinkronkan input saat URL parameter 'search' berubah dari LUAR 
  // (pencarian dari Navbar / tombol Back browser).
  useEffect(() => {
    if (urlSearchQuery !== debouncedQuery) {
      setSearchTerm(urlSearchQuery);
      setDebouncedQuery(urlSearchQuery);
    }
  }, [urlSearchQuery]);

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

  // 2. Debounce search & Update URL Parameter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm);
      if (searchTerm.trim() !== urlSearchQuery) {
        updateParams({ search: searchTerm.trim() || null });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, urlSearchQuery, updateParams]);

  // 2B. Reset page (di URL) setiap kali status search berubah —
  // baik mulai search baru, ganti kata kunci, maupun search di-clear.
  // Skip di render pertama supaya tidak menghapus ?page= yang sudah ada
  // di URL saat halaman dibuka/refresh dengan filter aktif.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    updateParams({}, { resetPage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // 3A. Fetch untuk mode SEARCH
  useEffect(() => {
    if (!isSearchActive) return; // ditangani effect 3B

    const controller = new AbortController();

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchMovies(debouncedQuery, {
          params: { primary_release_year: selectedYear || undefined, page },
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
  }, [debouncedQuery, selectedYear, page, retryTrigger, isSearchActive]);

  // 3B. Fetch untuk mode DISCOVER / DEFAULT
  useEffect(() => {
    if (isSearchActive) return; // ditangani effect 3A

    const controller = new AbortController();
    const hasFilter = selectedGenre !== '' || selectedYear !== '' || sortBy !== DEFAULT_SORT;

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
  }, [selectedGenre, selectedYear, sortBy, page, retryTrigger, isSearchActive]);

  // 4. Filter & sort di client, HANYA saat mode search aktif
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

  // --- Handlers ---
  const handleSearch = (e) => {
    const value = typeof e === 'string' ? e : e?.target?.value || '';
    setSearchTerm(value); // update input instan; URL menyusul setelah debounce
  };

  const handleGenreChange = (e) => {
    updateParams({ genre: e.target.value || null }, { resetPage: true });
  };

  const handleYearChange = (e) => {
    updateParams({ year: e.target.value || null }, { resetPage: true });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    updateParams({ sort: value !== DEFAULT_SORT ? value : null }, { resetPage: true });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    updateParams({ page: newPage !== 1 ? newPage : null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilter = selectedGenre !== '' || selectedYear !== '' || sortBy !== DEFAULT_SORT;
  const isGenreFilteredSearch = isSearchActive && selectedGenre !== '';

  return (
    <div className="movies-page-container min-h-screen bg-[#0f172a] text-white pb-20">
      <main className="movies-content">
        <header className="movies-header relative w-full pt-24 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-blue-900/30 via-[#0f172a]/80 to-[#0f172a] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] mb-4 tracking-wide mt-4 md:mt-6">
            Explore Movies
          </h1>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
            Find your favorite movies from TMDB.
          </p>
        </header>

        <section className="search-section w-full max-w-3xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 mb-12">
          <SearchBar
            value={searchTerm}
            onSearch={handleSearch}
            placeholder="Search movie by title..."
            className="w-full bg-gray-800/80 border border-gray-600 focus:border-cyan-500 rounded-full py-3 md:py-4 px-6 text-white placeholder-gray-400 outline-none transition-all duration-300 backdrop-blur-sm shadow-lg focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          />
        </section>

        <section className="filter-section container mx-auto px-4 md:px-8 mb-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-md border border-gray-700/60 rounded-xl px-4 py-2.5 w-full md:w-auto hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-300 group">
            <label htmlFor="filter-genre" className="text-xs md:text-sm font-semibold uppercase tracking-wider text-cyan-400 shrink-0 group-hover:text-cyan-300">Genre</label>
            <select id="filter-genre" value={selectedGenre} onChange={handleGenreChange} className="bg-transparent text-white text-sm md:text-base outline-none cursor-pointer w-full py-1 font-medium focus:text-cyan-300">
              <option value="" className="bg-gray-900 text-gray-300">All Genres</option>
              {genresList.map((g) => (
                <option key={g.id} value={g.id} className="bg-gray-900 text-white">{g.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-md border border-gray-700/60 rounded-xl px-4 py-2.5 w-full md:w-auto hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-300 group">
            <label htmlFor="filter-year" className="text-xs md:text-sm font-semibold uppercase tracking-wider text-cyan-400 shrink-0 group-hover:text-cyan-300">Year</label>
            <select id="filter-year" value={selectedYear} onChange={handleYearChange} className="bg-transparent text-white text-sm md:text-base outline-none cursor-pointer w-full py-1 font-medium focus:text-cyan-300">
              <option value="" className="bg-gray-900 text-gray-300">All Years</option>
              {years.map((year) => (
                <option key={year} value={year} className="bg-gray-900 text-white">{year}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-md border border-gray-700/60 rounded-xl px-4 py-2.5 w-full md:w-auto hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-300 group">
            <label htmlFor="filter-sort" className="text-xs md:text-sm font-semibold uppercase tracking-wider text-cyan-400 shrink-0 group-hover:text-cyan-300">Sort By</label>
            <select id="filter-sort" value={sortBy} onChange={handleSortChange} className="bg-transparent text-white text-sm md:text-base outline-none cursor-pointer w-full py-1 font-medium focus:text-cyan-300">
              <option value="popularity.desc" className="bg-gray-900 text-white">Most Popular</option>
              <option value="vote_average.desc" className="bg-gray-900 text-white">Highest Rated</option>
              <option value="primary_release_date.desc" className="bg-gray-900 text-white">Latest Release</option>
              <option value="title.asc" className="bg-gray-900 text-white">Title (A-Z)</option>
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
          <nav className="flex items-center justify-center gap-3 md:gap-4 mt-16 mb-12 px-4" aria-label="Pagination">
            <button
              type="button"
              className="px-5 py-2.5 md:px-7 md:py-3 bg-gray-800/60 border border-gray-700/80 text-gray-200 rounded-xl font-medium tracking-wide transition-all duration-300 hover:bg-cyan-600/20 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-800/60 disabled:hover:text-gray-200 disabled:hover:border-gray-700/80 disabled:hover:shadow-none"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <span className="text-sm md:text-base font-semibold text-gray-300 px-4 py-2 bg-gray-900/60 rounded-lg border border-gray-800 backdrop-blur-sm shadow-inner">
              Halaman {page} / {totalPages}
            </span>

            <button
              type="button"
              className="px-5 py-2.5 md:px-7 md:py-3 bg-gray-800/60 border border-gray-700/80 text-gray-200 rounded-xl font-medium tracking-wide transition-all duration-300 hover:bg-cyan-600/20 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-800/60 disabled:hover:text-gray-200 disabled:hover:border-gray-700/80 disabled:hover:shadow-none"
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