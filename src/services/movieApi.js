/**
 * movieApi.js
 * 
 * Kumpulan fungsi untuk memanggil spesifik endpoint terkait Movie di TMDB API.
 * Fungsi-fungsi ini memanfaatkan apiClient.js sebagai generic HTTP client.
 */

import { tmdbFetch } from "./apiClient.js";

// ============================================================================
// MOVIE LISTS (Lists film berdasarkan kategori tertentu)
// ============================================================================

/**
 * Mendapatkan daftar film trending.
 * @param {('day'|'week')} timeWindow - Jendela waktu trending, default 'day'
 * @param {Object} options - Opsi tambahan seperti { params: { page: 1, language: 'en-US' }, signal }
 * @returns {Promise<Object>}
 */
export function getTrendingMovies(timeWindow = "day", options = {}) {
  return tmdbFetch(`/trending/movie/${timeWindow}`, options);
}

/**
 * Mendapatkan daftar film populer.
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>}
 */
export function getPopularMovies(options = {}) {
  return tmdbFetch("/movie/popular", options);
}

/**
 * Mendapatkan daftar film yang sedang tayang di bioskop saat ini.
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>}
 */
export function getNowPlayingMovies(options = {}) {
  return tmdbFetch("/movie/now_playing", options);
}

/**
 * Mendapatkan daftar film dengan rating tertinggi.
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>}
 */
export function getTopRatedMovies(options = {}) {
  return tmdbFetch("/movie/top_rated", options);
}

/**
 * Mendapatkan daftar film yang akan segera tayang.
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>}
 */
export function getUpcomingMovies(options = {}) {
  return tmdbFetch("/movie/upcoming", options);
}


// ============================================================================
// SEARCH & DISCOVER
// ============================================================================

/**
 * Mencari film berdasarkan kata kunci (query).
 * @param {string} query - Kata kunci pencarian
 * @param {Object} options - Opsi tambahan (mis. { params: { page: 2 } })
 * @returns {Promise<Object>}
 */
export function searchMovies(query, options = {}) {
  const mergedOptions = {
    ...options,
    params: {
      ...options.params,
      query, // Masukkan query ke dalam params
    },
  };
  return tmdbFetch("/search/movie", mergedOptions);
}


// Function Discover dengan filter kombinasi genre, year, dan sort
// Function Discover dengan filter kombinasi genre, year, dan sort
export const getDiscoverMovies = async (genre, year, sortBy, options = {}) => {
  const params = { ...options.params };

  if (sortBy) params.sort_by = sortBy;
  if (genre) params.with_genres = genre;
  if (year) params.primary_release_year = year;

  // tmdbFetch sudah return JSON parsed langsung, jangan diakses .data lagi
  return tmdbFetch('/discover/movie', { ...options, params });
};
// ============================================================================
// GENRES
// ============================================================================

/**
 * Mendapatkan daftar genre film resmi (id & nama).
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>}
 */
export function getMovieGenres(options = {}) {
  return tmdbFetch("/genre/movie/list", options);
}


// ============================================================================
// MOVIE SPECIFIC (Informasi terkait satu film spesifik berdasarkan ID)
// ============================================================================

/**
 * Mendapatkan detail lengkap dari suatu film.
 * Bisa menggunakan append_to_response untuk menggabungkan request, contoh:
 * { params: { append_to_response: 'videos,credits' } }
 * 
 * @param {number|string} movieId - ID film
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>}
 */
export function getMovieDetails(movieId, options = {}) {
  return tmdbFetch(`/movie/${movieId}`, options);
}

/**
 * Mendapatkan daftar pemeran (cast) dan kru (crew) dari suatu film.
 * @param {number|string} movieId - ID film
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>}
 */
export function getMovieCredits(movieId, options = {}) {
  return tmdbFetch(`/movie/${movieId}/credits`, options);
}

/**
 * Mendapatkan daftar video (trailer, teaser, dsb) terkait film.
 * @param {number|string} movieId - ID film
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>}
 */
export function getMovieVideos(movieId, options = {}) {
  return tmdbFetch(`/movie/${movieId}/videos`, options);
}

/**
 * Mendapatkan daftar gambar (poster, backdrop) dari suatu film.
 * @param {number|string} movieId - ID film
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>}
 */
export function getMovieImages(movieId, options = {}) {
  return tmdbFetch(`/movie/${movieId}/images`, options);
}

/**
 * Mendapatkan daftar film yang mirip dengan film spesifik.
 * @param {number|string} movieId - ID film
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>}
 */
export function getSimilarMovies(movieId, options = {}) {
  return tmdbFetch(`/movie/${movieId}/similar`, options);
}

/**
 * Mendapatkan daftar rekomendasi film berdasarkan film tertentu.
 * @param {number|string} movieId - ID film
 * @param {Object} options - Opsi tambahan
 * @returns {Promise<Object>}
 */
export function getMovieRecommendations(movieId, options = {}) {
  return tmdbFetch(`/movie/${movieId}/recommendations`, options);
}
