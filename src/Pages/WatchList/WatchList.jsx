import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getWatchlist, removeFromWatchlist } from '../../services/watchlistApi';
import { LoadingSpinner } from '../../Component/Loading/loading';
import ErrorMessage from '../../Component/ErrorMessage/errorMessage';
import Footer from '../../Component/Footer/footer';
import MovieCard from '../../Component/MovieCard/movieCard';

/* ─────────────────────────────────────────────
   Watchlist Page
   - Not logged in → guest prompt (login / register), sama pola dengan Profile.jsx
   - Logged in     → daftar film yang disimpan user, diambil dari Supabase
───────────────────────────────────────────── */
export default function Watchlist() {
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const fetchWatchlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getWatchlist(user.id);
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
      setError(err.message || 'Gagal memuat watchlist.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleRemove = async (movieId) => {
    setRemovingId(movieId);
    try {
      const { error: removeError } = await removeFromWatchlist(user.id, movieId);
      if (!removeError) {
        setItems((prev) => prev.filter((item) => item.movie_id !== movieId));
      }
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    } finally {
      setRemovingId(null);
    }
  };

  // AuthProvider sudah menahan render sampai auth resolve, ini fallback saja
  if (authLoading) return null;

  /* ─── GUEST VIEW ─── */
  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[var(--background-primary)] px-4">
        <div className="max-w-sm w-full text-center space-y-6 py-12 px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            You're not logged in
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Log in untuk melihat dan mengelola watchlist kamu.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.35)]"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-[var(--text-primary)] bg-[var(--background-secondary)] border border-[var(--border-subtle)] hover:border-blue-500/50 hover:bg-blue-500/8 transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─── LOGGED-IN VIEW ─── */
  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--background-primary,#05070C)] text-white px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
          My Watchlist
        </h1>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner />
          </div>
        )}

        {!loading && error && (
          <ErrorMessage message={error} onRetry={fetchWatchlist} />
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="mb-4">Belum ada film di watchlist kamu.</p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
            >
              Cari Film
            </Link>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            {items.map((item) => (
              <div key={item.id} className="relative group">
                <MovieCard
                  movie={{
                    id: item.movie_id,
                    title: item.movie_title,
                    poster_path: item.poster_path,
                    release_date: item.release_date,
                  }}
                />
                <button
                  onClick={() => handleRemove(item.movie_id)}
                  disabled={removingId === item.movie_id}
                  className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-red-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-50"
                >
                  {removingId === item.movie_id ? '...' : 'Hapus'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}