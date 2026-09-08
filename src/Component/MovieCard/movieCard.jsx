import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlareHover from '../GlareHover/GlareHover';
import { normalizeMovieData } from '../../utils/genreHelper';
import { useAuth } from '../../context/AuthContext';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../services/watchlistApi';
import './movieCard.css';

const MovieCard = ({ movie }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (!movie) return null;

  // Normalisasi data film agar mendukung berbagai format API / state
  const {
    id,
    title,
    rating,
    year,
    posterUrl,
    synopsis,
    genres,
    director,
    duration,
    minAge,
  } = normalizeMovieData(movie);

  // Sinkronisasi status bookmark dengan watchlist di Supabase setiap kali
  // user login/logout atau card menampilkan film yang berbeda.
  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      if (!user || !id) {
        if (isMounted) setIsAddedToWatchlist(false);
        return;
      }
      try {
        const exists = await isInWatchlist(user.id, id);
        if (isMounted) setIsAddedToWatchlist(exists);
      } catch (err) {
        console.error('Failed to check watchlist status:', err);
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [user, id]);

  const handleCardClick = () => {
    if (id) {
      navigate(`/movie/${id}`);
    }
  };

  const toggleInfo = (e) => {
    e.stopPropagation();
    setShowInfo((prev) => !prev);
  };

  const handleWatchlist = async (e) => {
    e.stopPropagation();

    // Belum login → arahkan ke halaman login, balik lagi ke halaman ini setelahnya
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (watchlistLoading) return;
    setWatchlistLoading(true);

    try {
      if (isAddedToWatchlist) {
        const { error } = await removeFromWatchlist(user.id, id);
        if (!error) setIsAddedToWatchlist(false);
      } else {
        // movie (prop asli, sebelum dinormalisasi) masih punya field mentah
        // TMDB seperti poster_path & release_date — dipakai langsung di sini.
        const { error } = await addToWatchlist(user.id, {
          id,
          title,
          poster_path: movie.poster_path ?? null,
          release_date: movie.release_date ?? null,
        });
        if (!error) setIsAddedToWatchlist(true);
      }
    } catch (err) {
      console.error('Failed to toggle watchlist:', err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  return (
    <GlareHover 
      className="group relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer bg-[var(--surface-primary,#0D1320)] shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 isolate border border-white/5"
      onClick={handleCardClick}
      width="100%"
      height="100%"
      background="var(--surface-primary,#0D1320)"
      borderRadius="1rem"
      borderColor="rgba(255, 255, 255, 0.08)"
      glareColor="#ffffff"
      glareOpacity={0.15}
    >
      {/* 1. Poster Image */}
      {posterUrl ? (
        <img 
          src={posterUrl}
          alt={`Poster film ${title}`} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center p-4 text-center text-gray-400">
          <svg className="w-12 h-12 mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <span className="text-xs font-semibold">{title}</span>
        </div>
      )}
      
      {/* 2. Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070C] via-[#05070C]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500 z-10 pointer-events-none" />

      {/* 3. FLOATING HOVER RATING BADGE (Top-Left) */}
      {/* Tampil sangat menonjol saat di-hover dan selalu mudah terlihat */}
      <div 
        className={`absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border transition-all duration-300 shadow-md ${
          showInfo ? 'opacity-0 pointer-events-none' : 'opacity-90 group-hover:opacity-100 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(251,191,36,0.4)]'
        } bg-black/50 border-yellow-500/40 text-yellow-400`}
        title={`Rating: ${rating}`}
      >
        <svg className="w-3.5 h-3.5 fill-current text-yellow-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="text-xs font-bold tracking-wide text-white drop-shadow">
          {rating}
        </span>
      </div>

      {/* 4. Top Right Actions (Watchlist & Info Toggle Buttons) */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-30">
        <button 
          className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center disabled:opacity-60 ${
            isAddedToWatchlist 
              ? 'bg-blue-600/90 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-105' 
              : 'bg-black/40 border-white/20 text-white hover:bg-white/25 hover:border-white/40 hover:scale-110'
          }`}
          onClick={handleWatchlist}
          disabled={watchlistLoading}
          title={isAddedToWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          aria-label={isAddedToWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          {watchlistLoading ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isAddedToWatchlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          )}
        </button>
        
        <button 
          className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center ${
            showInfo 
              ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-105' 
              : 'bg-black/40 border-white/20 text-white hover:bg-cyan-500/30 hover:border-cyan-400 hover:scale-110'
          }`}
          onClick={toggleInfo}
          title={showInfo ? "Close Info" : "Show Info & Synopsis"}
          aria-label="Toggle movie information"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      </div>

      {/* 5. Glassmorphism Info Panel (Slides Up when Clicked) */}
      <div 
        className={`absolute inset-0 z-20 flex flex-col justify-between p-3.5 sm:p-4 md:p-5 bg-[var(--mc-glass-bg)] backdrop-blur-xl transition-all duration-500 ease-in-out border-t border-[var(--mc-accent-color)]/30 ${
          showInfo 
            ? 'translate-y-0 opacity-100 pointer-events-auto' 
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header inside Info Panel */}
        <div>
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h4 className="text-sm sm:text-base md:text-lg font-bold text-[var(--mc-text-color)] leading-snug line-clamp-2 drop-shadow-md">
              {title}
            </h4>
            <button 
              className="p-1 rounded-full bg-slate-200/80 dark:bg-white/10 hover:bg-red-500/20 dark:hover:bg-red-500/30 text-slate-700 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0" 
              onClick={toggleInfo}
              aria-label="Close info"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Rating, Year & Extra Metadata */}
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <div className="flex items-center gap-1 bg-amber-500/15 dark:bg-yellow-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 dark:border-yellow-500/30 font-bold">
              <svg className="w-3 h-3 fill-current text-amber-700 dark:text-yellow-400" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-xs font-bold text-amber-800 dark:text-yellow-300">{rating}</span>
            </div>

            {year && (
              <span className="px-2 py-0.5 bg-slate-200/90 dark:bg-white/10 border border-slate-300 dark:border-white/10 rounded-md text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-gray-200">
                {year}
              </span>
            )}
            
            {minAge && (
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 border border-blue-400/60 dark:border-blue-500/40 rounded-md text-[10px] sm:text-xs font-bold text-blue-800 dark:text-blue-200">
                {minAge}
              </span>
            )}

            {duration && (
              <span className="px-2 py-0.5 bg-slate-200/90 dark:bg-white/10 border border-slate-300 dark:border-white/10 rounded-md text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-gray-300">
                {duration}
              </span>
            )}
          </div>

          {/* Genre Pills */}
          <div className="flex flex-wrap gap-1 mb-2.5 max-h-[48px] overflow-hidden">
            {genres.map((g, idx) => (
              <span 
                key={idx}
                className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-400/60 dark:border-cyan-400/30 rounded-md text-[10px] sm:text-xs font-bold text-cyan-900 dark:text-cyan-300 tracking-tight"
              >
                {g}
              </span>
            ))}
          </div>

          {director && (
            <p className="text-[11px] text-slate-600 dark:text-gray-400 mb-2 truncate">
              Sutradara: <span className="text-slate-900 dark:text-gray-200 font-bold">{director}</span>
            </p>
          )}
        </div>

        {/* Synopsis Area - Responsif dengan scrollbar halus agar tidak keluar dari kartu */}
        <div className="mc-synopsis-container flex-grow overflow-y-auto my-1 pr-1.5 max-h-[120px] sm:max-h-[150px] md:max-h-[180px]">
          <p className="text-[11px] sm:text-xs text-slate-800 dark:text-gray-300 leading-relaxed font-normal break-words">
            {synopsis}
          </p>
        </div>

        {/* Bottom Action inside Info Panel */}
        <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5 shrink-0 mt-auto">
          <button 
            className="w-full py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            onClick={handleCardClick}
          >
            <span>Lihat Detail Film</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* 6. Standard Card Footer (Title & Rating) - Hidden when Info panel is open */}
      <div 
        className={`absolute bottom-0 left-0 w-full p-3.5 sm:p-4 z-10 transition-all duration-500 ease-in-out ${
          showInfo ? 'translate-y-4 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <h3 className="text-sm sm:text-base font-bold text-white mb-1 truncate drop-shadow-md group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-300">
          <div className="flex items-center gap-1 text-yellow-400 font-semibold">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>{rating}</span>
          </div>

          {year && (
            <span className="text-[11px] text-gray-400 font-medium">
              {year}
            </span>
          )}
        </div>
      </div>
    </GlareHover>
  );
};

export default MovieCard;