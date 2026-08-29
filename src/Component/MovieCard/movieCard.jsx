import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
  const navigate = useNavigate();
  
  
  if (!movie) return null;
  const posterUrl = movie.poster_path? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`:null;

  const handleCardClick = () => {
    // Only navigate if info panel is not open, or make info panel a separate layer.
    // We can allow navigation anytime the main card is clicked.
    navigate(`/movie/${movie.id}`);
  };

  const toggleInfo = (e) => {
    e.stopPropagation();
    setShowInfo((prev) => !prev);
  };

  const handleWatchlist = (e) => {
    e.stopPropagation();
    setIsAddedToWatchlist((prev) => !prev);
  };

  return (
    <div 
      className="group relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer bg-[var(--surface-primary)] shadow-lg hover:shadow-2xl hover:shadow-[var(--primary-500)]/20 transition-all duration-500 isolate"
      onClick={handleCardClick}
    >
      {/* 1. Poster Image - The Main Focus */}
      <img 
        src={posterUrl}
        alt={`Poster film ${movie.title}`} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      
      {/* 2. Cinematic Gradient Overlay */}
      {/* Always visible at the bottom for text readability, slightly darker on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B10] via-[#0B0B10]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500 z-10 pointer-events-none" />

      {/* 3. Top Right Actions */}
      <div className="absolute top-3 right-3 flex flex-col gap-2.5 z-30">
        <button 
          className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center
            ${isAddedToWatchlist 
              ? 'bg-[var(--primary-color)]/80 border-[var(--primary-color)] text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
              : 'bg-black/30 border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:scale-110'
            }`}
          onClick={handleWatchlist}
          title={isAddedToWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          aria-label={isAddedToWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isAddedToWatchlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        
        <button 
          className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 flex items-center justify-center
            ${showInfo 
              ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
              : 'bg-black/30 border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:scale-110'
            }`}
          onClick={toggleInfo}
          title="More Info"
          aria-label="Toggle movie information"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      </div>

      {/* 4. Glassmorphism Info Panel (Slides Up) */}
      <div 
        className={`absolute inset-0 z-20 flex flex-col justify-end p-5 bg-[var(--background-primary)]/80 backdrop-blur-xl transition-all duration-500 ease-in-out
          ${showInfo ? 'translate-y-0 opacity-100' : 'translate-y-[10px] opacity-0 pointer-events-none'}`}
        onClick={(e) => {
          // If clicking the overlay background itself, we can close it or let it propagate.
          // Let's stop propagation so clicking the info panel doesn't trigger the card click (navigation).
          e.stopPropagation();
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-xl md:text-2xl font-bold text-white leading-tight drop-shadow-md">
            {movie.title}
          </h4>
          <button 
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0" 
            onClick={toggleInfo}
            aria-label="Close info"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1 bg-white/10 border border-white/10 rounded-md text-xs font-medium text-gray-200 backdrop-blur-sm">
            {movie.year}
          </span>
          <span className="px-2.5 py-1 bg-[var(--primary-900)]/50 border border-[var(--primary-color)]/30 rounded-md text-xs font-semibold text-[var(--primary-100)] backdrop-blur-sm">
            {movie.minAge}
          </span>
          <span className="px-2.5 py-1 bg-white/10 border border-white/10 rounded-md text-xs font-medium text-gray-200 backdrop-blur-sm">
            {movie.duration}
          </span>
        </div>

        <p className="text-sm font-medium text-[var(--primary-light)] mb-3">
          {movie.genre}
        </p>
        
        <div className="flex-grow overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
          <p className="text-sm text-gray-300 leading-relaxed">
            {movie.synopsis}
          </p>
        </div>
      </div>

      {/* 5. Bottom Content (Title & Rating) - Fades out slightly when Info is open */}
      <div 
        className={`absolute bottom-0 left-0 w-full p-4 md:p-5 z-10 transition-all duration-500 ease-in-out
          ${showInfo ? 'translate-y-4 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
      >
        <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 truncate drop-shadow-lg">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-1.5">
          <svg className="text-[var(--premium-color)] drop-shadow-[0_0_5px_rgba(212,175,112,0.5)]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span className="text-sm font-semibold text-gray-200">
            {movie.rating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
