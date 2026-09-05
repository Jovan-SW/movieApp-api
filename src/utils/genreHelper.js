/**
 * genreHelper.js
 * Utilitas untuk memetakan ID Genre TMDB dan menormalisasi objek movie
 * dari berbagai sumber data (TMDB API, mock data, atau custom props).
 */

export const TMDB_GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

/**
 * Mendapatkan daftar nama genre dari objek movie
 * @param {Object} movie 
 * @returns {string[]} Array nama genre, misal ['Action', 'Sci-Fi']
 */
export const getMovieGenres = (movie) => {
  if (!movie) return [];

  // Jika movie.genre_ids ada (dari daftar TMDB API)
  if (Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0) {
    const genres = movie.genre_ids
      .map((id) => TMDB_GENRES[id])
      .filter(Boolean);
    if (genres.length > 0) return genres;
  }

  // Jika movie.genres berupa array dari object [{id, name}] (dari detail TMDB API)
  if (Array.isArray(movie.genres) && movie.genres.length > 0) {
    return movie.genres.map((g) => (typeof g === 'object' ? g.name : g)).filter(Boolean);
  }

  // Jika movie.genre berupa string tunggal atau koma (misal "Action, Sci-Fi")
  if (typeof movie.genre === 'string' && movie.genre.trim() !== '') {
    return movie.genre.split(',').map((g) => g.trim()).filter(Boolean);
  }

  // Fallback
  return ['General'];
};

/**
 * Menormalisasi properti movie dari berbagai format API / state
 * @param {Object} movie 
 * @returns {Object} Properti terpadu { title, rating, year, posterUrl, backdropUrl, synopsis, genres }
 */
export const normalizeMovieData = (movie) => {
  if (!movie) return {};

  const title = movie.title || movie.name || movie.original_title || 'Untitled Movie';
  
  // Rating format (vote_average di TMDB biasanya float 7.823)
  const rawRating = movie.vote_average ?? movie.rating;
  const rating = rawRating != null && !isNaN(rawRating)
    ? Number(rawRating).toFixed(1)
    : 'N/A';

  // Release year
  const rawDate = movie.release_date || movie.first_air_date || '';
  const year = rawDate ? rawDate.split('-')[0] : (movie.year || '');

  // Poster URL
  let posterUrl = null;
  if (movie.poster_path) {
    posterUrl = movie.poster_path.startsWith('http')
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  } else if (movie.poster_url || movie.poster) {
    posterUrl = movie.poster_url || movie.poster;
  }

  // Backdrop URL
  let backdropUrl = null;
  if (movie.backdrop_path) {
    backdropUrl = movie.backdrop_path.startsWith('http')
      ? movie.backdrop_path
      : `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`;
  }

  // Synopsis / Overview
  const synopsis = movie.overview || movie.synopsis || movie.description || 'Sinopsis tidak tersedia untuk film ini.';

  const genres = getMovieGenres(movie);

  return {
    id: movie.id,
    title,
    rating,
    year,
    posterUrl,
    backdropUrl,
    synopsis,
    genres,
    director: movie.director || null,
    duration: movie.duration || null,
    minAge: movie.minAge || null,
  };
};
