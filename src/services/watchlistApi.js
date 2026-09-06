/**
 * watchlistApi.js
 *
 * Kumpulan fungsi untuk mengelola watchlist milik user yang sedang login.
 * Semua operasi menyasar tabel `watchlist` di Supabase, yang sudah dilindungi
 * Row Level Security (RLS) — sehingga setiap user hanya bisa membaca/mengubah
 * baris miliknya sendiri (berdasarkan auth.uid() = user_id di sisi database).
 *
 * Kolom tabel `watchlist`:
 *   id, user_id, movie_id, movie_title, poster_path, release_date, created_at
 *
 * Fungsi-fungsi di sini TIDAK melakukan pengecekan otentikasi (apakah user
 * login atau tidak) — itu tanggung jawab komponen pemanggil (lewat useAuth()).
 * Modul ini murni bertanggung jawab atas komunikasi ke Supabase.
 */

import { supabase } from "./supabaseClient";

const TABLE_NAME = "wishlists";

/**
 * Mengecek apakah sebuah film sudah ada di watchlist user tertentu.
 *
 * @param {string} userId - ID user (dari Supabase Auth, user.id)
 * @param {number|string} movieId - ID film (TMDB movie id)
 * @returns {Promise<boolean>}
 */
export async function isInWatchlist(userId, movieId) {
  if (!userId || !movieId) return false;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("id")
    .eq("user_id", userId)
    .eq("movie_id", Number(movieId))
    .maybeSingle();

  if (error) {
    console.error("[watchlistApi] Failed to check watchlist status:", error.message);
    throw error;
  }

  return !!data;
}

/**
 * Mengambil seluruh isi watchlist milik user, diurutkan dari yang terbaru
 * ditambahkan.
 *
 * @param {string} userId
 * @returns {Promise<Array<Object>>}
 */
export async function getWatchlist(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[watchlistApi] Failed to fetch watchlist:", error.message);
    throw error;
  }

  return data ?? [];
}

/**
 * Menambahkan film ke watchlist user. Mencegah duplikat: jika film dengan
 * movie_id yang sama sudah ada untuk user ini, insert dibatalkan sebelum
 * sempat mengirim request insert (dan juga dijaga di sisi DB lewat error
 * code 23505 kalau ada unique constraint (user_id, movie_id)).
 *
 * @param {string} userId
 * @param {{ id: number|string, title: string, poster_path?: string|null, release_date?: string|null }} movie
 * @returns {Promise<{ data: Object|null, error: string|null }>}
 */
export async function addToWatchlist(userId, movie) {
  if (!userId) {
    return { data: null, error: "User belum login." };
  }
  if (!movie?.id) {
    return { data: null, error: "Data film tidak valid." };
  }

  try {
    const exists = await isInWatchlist(userId, movie.id);
    if (exists) {
      return { data: null, error: null, alreadyExists: true };
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        user_id: userId,
        movie_id: Number(movie.id),
        movie_title: movie.title ?? null,
        poster_path: movie.poster_path ?? null,
        release_date: movie.release_date ?? null,
      })
      .select()
      .single();

    if (error) {
      // 23505 = unique_violation (kalau ada unique constraint di DB, ini jaring pengaman
      // untuk race condition, misal user klik dobel dengan cepat / dua tab sekaligus).
      if (error.code === "23505") {
        return { data: null, error: "Film sudah ada di watchlist." };
      }
      console.error("[watchlistApi] Failed to add to watchlist:", error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || "Gagal menambahkan ke watchlist." };
  }
}

/**
 * Menghapus film dari watchlist user.
 *
 * @param {string} userId
 * @param {number|string} movieId
 * @returns {Promise<{ error: string|null }>}
 */
export async function removeFromWatchlist(userId, movieId) {
  if (!userId || !movieId) {
    return { error: "Parameter tidak lengkap." };
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("user_id", userId)
    .eq("movie_id", Number(movieId));

  if (error) {
    console.error("[watchlistApi] Failed to remove from watchlist:", error.message);
    return { error: error.message };
  }

  return { error: null };
}