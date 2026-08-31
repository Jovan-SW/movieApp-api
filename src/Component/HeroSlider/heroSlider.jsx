import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Info, Calendar } from 'lucide-react';
import { getNowPlayingMovies, getMovieGenres } from '../../services/movieApi';

const HeroSlider = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Setup Fetch Data
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const [movieData, genreData] = await Promise.all([
          getNowPlayingMovies(),
          getMovieGenres(),
        ]);

        const genreMap = {};
        const genreList = genreData.genres || genreData; 
        if (Array.isArray(genreList)) {
          genreList.forEach((g) => {
            genreMap[g.id] = g.name;
          });
        }

        const movieList = movieData.results || movieData;
        if (Array.isArray(movieList)) {
          setMovies(movieList.slice(0, 6));
        }
        
        setGenres(genreMap);
      } catch (error) {
        console.error('Error fetching hero movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Logika Navigasi Slider
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === movies.length - 1 ? 0 : prevIndex + 1));
  }, [movies.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? movies.length - 1 : prevIndex - 1));
  }, [movies.length]);

  // Auto-play slider tiap 6 detik
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, movies.length]);

  if (loading || movies.length === 0) {
    return (
      <div className="w-full h-screen bg-neutral-900 animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--primary-color,#3b82f6)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // Menggunakan h-screen agar menutupi 1 halaman penuh (100vh)
    <div className="relative w-full h-screen overflow-hidden bg-black group">
      {movies.map((movie, index) => {
        const isActive = index === currentIndex;
        
        return (
          <div
            key={movie.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Backdrop Image & Gradient Overlay */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-full object-cover object-top"
              />
              {/* Gradient disesuaikan agar lebih gelap di bagian bawah untuk transisi halus saat di-scroll */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f11] via-[#0f0f11]/70 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/20 to-transparent"></div>
            </div>

            {/* Content Container - Dibuat rata kiri dengan max-width yang lebih besar karena poster dihilangkan */}
            <div className="absolute inset-0 container mx-auto px-6 md:px-12 flex items-center justify-start">
              
              <div className="w-full max-w-3xl text-white flex flex-col items-start gap-5 transform transition-all duration-700 translate-y-0 opacity-100 mt-16">
                
                {/* Rating & Year */}
                <div className="flex items-center gap-4 text-sm font-medium tracking-wider">
                  <span className="flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-full backdrop-blur-sm border border-yellow-500/30">
                    <Star size={16} className="fill-current" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-300 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Calendar size={16} />
                    {movie.release_date.split('-')[0]}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-2xl text-balance">
                  {movie.title}
                </h1>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {movie.genre_ids.slice(0, 4).map((id) => (
                    <span
                      key={id}
                      className="px-4 py-1.5 text-sm font-medium bg-white/10 text-gray-100 rounded-lg backdrop-blur-md border border-white/10"
                    >
                      {genres[id]}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <p className="mt-4 text-gray-300 text-base md:text-lg leading-relaxed line-clamp-3 md:line-clamp-4 text-shadow-sm">
                  {movie.overview}
                </p>

                {/* Call to Action Button */}
                <button 
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="mt-6 flex items-center gap-3 bg-[var(--primary-color,#3b82f6)] hover:bg-[var(--primary-hover,#2563eb)] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                >
                  <Info size={22} />
                  <span className="text-lg">More Info</span>
                </button>
              </div>

            </div>
          </div>
        );
      })}

      {/* Kontrol Navigasi */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 hover:bg-black/80 text-white rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft size={36} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 hover:bg-black/80 text-white rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <ChevronRight size={36} />
      </button>

      {/* Indikator Titik Bawah (Dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'w-10 h-2.5 bg-[var(--primary-color,#3b82f6)] shadow-[0_0_12px_rgba(59,130,246,0.8)]' 
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Efek visual fade ke bawah untuk menyatu mulus saat di scroll */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--background-color,#0a0a0a)] to-transparent pointer-events-none z-10"></div>
    </div>
  );
};

export default HeroSlider;