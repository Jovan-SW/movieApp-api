import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getMovieCredits, getSimilarMovies } from '../../services/movieApi';
import { normalizeMovieData } from '../../utils/genreHelper';
import { LoadingSpinner } from '../../Component/Loading/loading';
import ErrorMessage from '../../Component/ErrorMessage/errorMessage';
import Footer from '../../Component/Footer/footer';
import MovieCard from '../../Component/MovieCard/movieCard';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      // Scroll to top when changing movies
      window.scrollTo(0, 0);
      try {
        const [detailData, creditsData, similarData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id).catch(() => ({ cast: [] })),
          getSimilarMovies(id).catch(() => ({ results: [] }))
        ]);
        
        setMovie(normalizeMovieData(detailData));
        
        // Batasi jumlah cast menjadi 8 karakter utama saja
        setCast(creditsData?.cast ? creditsData.cast.slice(0, 8) : []);
        
        // Ambil 10 similar movies
        setSimilarMovies(similarData?.results ? similarData.results.slice(0, 10) : []);
      } catch (err) {
        console.error('Failed to fetch movie detail:', err);
        setError(err.message || 'Gagal memuat detail film.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background-primary,#05070C)] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background-primary,#05070C)] flex flex-col items-center justify-center">
        <ErrorMessage message={error} onRetry={() => navigate(0)} />
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[var(--background-primary,#05070C)] flex items-center justify-center text-white">
        Film tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-primary,#05070C)] text-white font-sans selection:bg-blue-500 selection:text-white pb-20">
      {/* 1. Backdrop Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        {movie.backdropUrl ? (
          <img 
            src={movie.backdropUrl} 
            alt={`Backdrop ${movie.title}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-primary,#05070C)] via-[#05070C]/60 to-transparent"></div>
      </div>

      {/* 2. Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">
          
          {/* Poster Kiri */}
          <div className="w-48 sm:w-64 md:w-1/3 lg:w-1/4 shrink-0">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
              {movie.posterUrl ? (
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                  No Poster
                </div>
              )}
            </div>
          </div>

          {/* Info Kanan */}
          <div className="flex-1 text-center md:text-left mt-4 md:mt-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg mb-4">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-sm text-gray-300">
              <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="font-bold text-yellow-400">{movie.rating}</span>
              </div>
              
              {movie.year && (
                <span className="bg-white/10 px-3 py-1 rounded-full font-medium">
                  {movie.year}
                </span>
              )}
              
              {movie.duration && (
                <span className="bg-white/10 px-3 py-1 rounded-full font-medium">
                  {movie.duration}m
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                {movie.genres.map((g, idx) => (
                  <span 
                    key={idx} 
                    className="px-4 py-1.5 bg-cyan-900/40 text-cyan-300 text-sm font-semibold rounded-full border border-cyan-700/50"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-white mb-3">Sinopsis</h3>
              <p className="text-gray-300 leading-relaxed max-w-3xl text-base md:text-lg">
                {movie.synopsis}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-all hover:scale-105">
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>

        {/* 3. Cast Section */}
        {cast.length > 0 && (
          <div className="mt-16 md:mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-white border-l-4 border-[var(--premium-color,#B7C7DB)] pl-4 tracking-wide uppercase text-sm md:text-base mb-8">
              Pemeran Utama
            </h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-6 md:gap-8">
              {cast.map((actor) => (
                <div key={actor.id} className="flex flex-col items-center group w-20 sm:w-28 text-center">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-900 border-2 border-white/10 group-hover:border-cyan-500/50 transition-all duration-300 shadow-lg relative mb-3">
                    {actor.profile_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                        alt={actor.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-10 h-10 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-white mb-0.5 line-clamp-2 leading-tight" title={actor.name}>
                    {actor.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 line-clamp-2 leading-tight" title={actor.character}>
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Similar Movies Section */}
        {similarMovies.length > 0 && (
          <div className="mt-16 md:mt-24">
            <h2 className="text-2xl md:text-3xl font-bold text-white border-l-4 border-[var(--premium-color,#B7C7DB)] pl-4 tracking-wide uppercase text-sm md:text-base mb-8">
              Rekomendasi Serupa
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
              {similarMovies.map((similarMovie) => (
                <div key={similarMovie.id} className="transform scale-95 origin-top transition-transform hover:scale-100">
                  <MovieCard movie={similarMovie} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default MovieDetail;
