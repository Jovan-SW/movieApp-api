import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// ─── API Functions ───
import {
  getTrendingMovies,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieGenres,
} from '../../services/movieApi';

// ─── Components ───
import { LoadingSpinner, MovieGridSkeleton } from '../../Component/Loading/loading';
import { ErrorMessage } from '../../Component/ErrorMessage/errorMessage';
import MovieGrid from '../../Component/MovieGrid/movieGrid';
import HeroSlider from '../../Component/HeroSlider/heroSlider';
/**
 * Home Page
 *
 * Sections:
 *  1. Hero Banner   — Spotlight from trending movie #1
 *  2. Trending      — getTrendingMovies('day')
 *  3. Now Playing   — getNowPlayingMovies()
 *  4. Popular       — getPopularMovies()
 *  5. Top Rated     — getTopRatedMovies()
 *  6. Upcoming      — getUpcomingMovies()
 *
 * State structure per-section: { data, loading, error }
 * Global genre map fetched once for ID→name resolution.
 */
function Home() {
  const navigate = useNavigate();

  // ─── Genre map (id → name) ─────────────────────────────────
  const [genreMap, setGenreMap] = useState({});

  // ─── Section states ────────────────────────────────────────
  const [trending,   setTrending]   = useState({ data: [], loading: true, error: null });
  const [nowPlaying, setNowPlaying] = useState({ data: [], loading: true, error: null });
  const [popular,    setPopular]    = useState({ data: [], loading: true, error: null });
  const [topRated,   setTopRated]   = useState({ data: [], loading: true, error: null });
  const [upcoming,   setUpcoming]   = useState({ data: [], loading: true, error: null });


  // ─── Data fetching ─────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // Helper: fetch a section and update its state
    const fetchSection = async (apiFn, setter, ...apiArgs) => {
      try {
        const response = await apiFn(...apiArgs, { signal });
        setter({ data: response.results ?? [], loading: false, error: null });
      } catch (err) {
        // Don't update state if request was cancelled (component unmount)
        if (err.name === 'AbortError') return;
        setter({ data: [], loading: false, error: err.message || 'Failed to load data.' });
      }
    };

    // Fetch genre map
    const fetchGenres = async () => {
      try {
        const res = await getMovieGenres({ signal });
        const map = {};
        (res.genres ?? []).forEach((g) => { map[g.id] = g.name; });
        setGenreMap(map);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.warn('[Home] Could not load genres:', err.message);
      }
    };

    // Fire all fetches in parallel — independent of each other
    fetchGenres();
    fetchSection(getTrendingMovies,   setTrending,   'day');
    fetchSection(getNowPlayingMovies, setNowPlaying);
    fetchSection(getPopularMovies,    setPopular);
    fetchSection(getTopRatedMovies,   setTopRated);
    fetchSection(getUpcomingMovies,   setUpcoming);

    // Cleanup: abort all in-flight requests on unmount
    return () => controller.abort();
  }, []);

  // ─── Derived state ─────────────────────────────────────────
  const isInitialLoading =
    trending.loading && nowPlaying.loading && popular.loading && topRated.loading && upcoming.loading;

  const allFailed =
    !trending.loading && !nowPlaying.loading && !popular.loading && !topRated.loading && !upcoming.loading &&
    trending.error && nowPlaying.error && popular.error && topRated.error && upcoming.error;


  // ─── Full-page loading ─────────────────────────────────────
  if (isInitialLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // ─── All sections failed ───────────────────────────────────
  if (allFailed) {
    return (
      <ErrorMessage
        message="We couldn't load any movie data right now. Please check your connection and try again."
        onRetry={() => window.location.reload()}
      />
    );
  }

  // ─── Main render ───────────────────────────────────────────
  return (
    <main>
      {/* ════════════════════════════════════════════════════════
          SECTION 1 — Hero Banner
          ════════════════════════════════════════════════════════ */}
      <HeroSlider />
        


      {/* ════════════════════════════════════════════════════════
          SECTION 2 — Trending Movies
          ════════════════════════════════════════════════════════ */}
      <section id="trending-section">
        {trending.loading ? (
          <MovieGridSkeleton count={10} />
        ) : trending.error ? (
          <ErrorMessage message={trending.error} fullHeight={false} />
        ) : (
          <MovieGrid movies={trending.data} title="🔥 Trending Today" />
        )}
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 3 — Now Playing
          ════════════════════════════════════════════════════════ */}
      <section id="now-playing-section">
        {nowPlaying.loading ? (
          <MovieGridSkeleton count={10} />
        ) : nowPlaying.error ? (
          <ErrorMessage message={nowPlaying.error} fullHeight={false} />
        ) : (
          <MovieGrid movies={nowPlaying.data} title="🎬 Now Playing" />
        )}
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 4 — Popular Movies
          ════════════════════════════════════════════════════════ */}
      <section id="popular-section">
        {popular.loading ? (
          <MovieGridSkeleton count={10} />
        ) : popular.error ? (
          <ErrorMessage message={popular.error} fullHeight={false} />
        ) : (
          <MovieGrid movies={popular.data} title="🌟 Popular" />
        )}
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 5 — Top Rated
          ════════════════════════════════════════════════════════ */}
      <section id="top-rated-section">
        {topRated.loading ? (
          <MovieGridSkeleton count={10} />
        ) : topRated.error ? (
          <ErrorMessage message={topRated.error} fullHeight={false} />
        ) : (
          <MovieGrid movies={topRated.data} title="🏆 Top Rated" />
        )}
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 6 — Upcoming
          ════════════════════════════════════════════════════════ */}
      <section id="upcoming-section">
        {upcoming.loading ? (
          <MovieGridSkeleton count={10} />
        ) : upcoming.error ? (
          <ErrorMessage message={upcoming.error} fullHeight={false} />
        ) : (
          <MovieGrid movies={upcoming.data} title="📅 Upcoming" />
        )}
      </section>
    </main>
  );
}

export default Home;