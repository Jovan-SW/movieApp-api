/**
 * apiClient.js
 *
 * Generic HTTP client for the TMDB REST API.
 *
 * Responsibilities:
 *  - Base URL & auth header construction
 *  - Query parameter serialization
 *  - Request timeout via AbortController
 *  - HTTP & network error handling with structured error objects
 *  - JSON response parsing
 *
 * This module does NOT contain movie-specific logic (getPopularMovies, etc.).
 * All movie/tv/people logic belongs in their respective api modules (movieApi.js, etc.).
 *
 * Security note:
 *   VITE_TMDB_API_TOKEN is bundled into the client-side JavaScript by Vite because of
 *   the "VITE_" prefix. It is NOT a server-side secret. Never log it, never put it in
 *   URLs, and never commit .env to version control. For a public read-only API like
 *   TMDB this is the accepted approach — see TMDB's own documentation.
 */

// ---------------------------------------------------------------------------
// Environment variable validation
// Fail fast with a clear message instead of a cryptic runtime crash later.
// ---------------------------------------------------------------------------

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;

if (!BASE_URL || !API_TOKEN) {
  throw new Error(
    "[apiClient] TMDB API configuration is missing. " +
      "Make sure VITE_TMDB_BASE_URL and VITE_TMDB_API_TOKEN are set in your .env file."
  );
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default request timeout in milliseconds. */
const DEFAULT_TIMEOUT_MS = 12_000;

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------

/**
 * Represents a failed TMDB API request.
 *
 * @property {number|null}  status    - HTTP status code, or null for network errors.
 * @property {string}       endpoint  - The endpoint that was requested.
 * @property {object|null}  body      - Parsed response body from TMDB, if available.
 */
export class ApiError extends Error {
  /**
   * @param {string}       message
   * @param {number|null}  status
   * @param {string}       endpoint
   * @param {object|null}  body
   */
  constructor(message, status, endpoint, body = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
    this.body = body;
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Safely joins BASE_URL and an endpoint, preventing double-slash issues
 * regardless of whether BASE_URL has a trailing slash or endpoint has a
 * leading slash.
 *
 * @param {string} endpoint - e.g. "/movie/popular"
 * @returns {string} - Full URL string
 */
function buildUrl(endpoint) {
  const base = BASE_URL.replace(/\/+$/, ""); // strip trailing slashes
  const path = endpoint.replace(/^\/+/, ""); // strip leading slashes
  return `${base}/${path}`;
}

/**
 * Serializes a plain params object into a URLSearchParams string,
 * skipping null and undefined values.
 *
 * @param {Record<string, unknown>} params
 * @returns {string} - e.g. "page=2&language=en-US"
 */
function serializeParams(params) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    // Skip params that carry no meaningful value.
    if (value === null || value === undefined) continue;
    searchParams.append(key, String(value));
  }

  return searchParams.toString();
}

/**
 * Attempts to parse the response body as JSON.
 * Returns null if the body is empty or not valid JSON, so a parse failure
 * never shadows the original HTTP error.
 *
 * @param {Response} response
 * @returns {Promise<object|null>}
 */
async function tryParseJson(response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) return null;

  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Maps an HTTP status code to a human-readable error message.
 *
 * @param {number}       status
 * @param {object|null}  body   - Parsed TMDB error body, if available.
 * @param {string}       endpoint
 * @returns {string}
 */
function resolveErrorMessage(status, body, endpoint) {
  // TMDB often returns { status_message: "..." } in error responses.
  const tmdbMessage = body?.status_message;

  switch (status) {
    case 401:
      return (
        tmdbMessage ??
        `[apiClient] Unauthorized (401): Invalid or missing API token. Endpoint: ${endpoint}`
      );
    case 404:
      return (
        tmdbMessage ??
        `[apiClient] Not Found (404): The requested resource does not exist. Endpoint: ${endpoint}`
      );
    case 429:
      return (
        tmdbMessage ??
        `[apiClient] Rate Limited (429): Too many requests. Please slow down. Endpoint: ${endpoint}`
      );
    default:
      if (status >= 500) {
        return (
          tmdbMessage ??
          `[apiClient] Server Error (${status}): TMDB is having issues. Endpoint: ${endpoint}`
        );
      }
      return (
        tmdbMessage ??
        `[apiClient] HTTP Error (${status}). Endpoint: ${endpoint}`
      );
  }
}

// ---------------------------------------------------------------------------
// Core fetch function
// ---------------------------------------------------------------------------

/**
 * Makes an authenticated HTTP request to the TMDB API.
 *
 * @param {string} endpoint - API path relative to BASE_URL, e.g. "/movie/popular".
 * @param {object} [options={}]
 * @param {Record<string, unknown>} [options.params]   - Query parameters.
 * @param {string}                  [options.method]   - HTTP method. Defaults to "GET".
 * @param {object}                  [options.body]     - Request body for POST/PUT/PATCH.
 * @param {AbortSignal}             [options.signal]   - AbortSignal for request cancellation.
 * @param {number}                  [options.timeout]  - Timeout in ms. Defaults to DEFAULT_TIMEOUT_MS.
 * @returns {Promise<object>} - Parsed JSON response from TMDB.
 * @throws {ApiError} - On HTTP errors, network failures, or timeout.
 */
export async function tmdbFetch(endpoint, options = {}) {
  const {
    params,
    method = "GET",
    body,
    signal: externalSignal,
    timeout = DEFAULT_TIMEOUT_MS,
  } = options;

  // --- Build URL ---
  let url = buildUrl(endpoint);

  if (params && typeof params === "object" && Object.keys(params).length > 0) {
    const queryString = serializeParams(params);
    if (queryString) url = `${url}?${queryString}`;
  }

  // --- Timeout via AbortController ---
  // Merge with any external AbortSignal (e.g. from React component cleanup).
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(
    () => timeoutController.abort(),
    timeout
  );

  // If the caller supplies their own signal, abort our internal controller
  // when the external signal fires (supporting both cancellation paths).
  externalSignal?.addEventListener("abort", () => timeoutController.abort(), {
    once: true,
  });

  // --- Request config ---
  const requestConfig = {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      // Token goes in the Authorization header only — never in the URL.
      Authorization: `Bearer ${API_TOKEN}`,
    },
    signal: timeoutController.signal,
  };

  if (body !== undefined && body !== null) {
    requestConfig.body = JSON.stringify(body);
  }

  // --- Execute request ---
  let response;

  try {
    response = await fetch(url, requestConfig);
  } catch (error) {
    clearTimeout(timeoutId);

    // AbortError is thrown for both timeout and caller-initiated cancellation.
    if (error.name === "AbortError") {
      // Re-throw if the caller explicitly cancelled — they can handle it themselves.
      if (externalSignal?.aborted) throw error;

      throw new ApiError(
        `[apiClient] Request timed out after ${timeout}ms. Endpoint: ${endpoint}`,
        null,
        endpoint
      );
    }

    // True network failure (no connection, DNS failure, etc.)
    throw new ApiError(
      `[apiClient] Network error: ${error.message}. Endpoint: ${endpoint}`,
      null,
      endpoint
    );
  } finally {
    clearTimeout(timeoutId);
  }

  // --- Handle HTTP errors ---
  if (!response.ok) {
    // Always attempt to read the error body for better diagnostics.
    const errorBody = await tryParseJson(response);
    const message = resolveErrorMessage(response.status, errorBody, endpoint);

    throw new ApiError(message, response.status, endpoint, errorBody);
  }

  // --- Parse and return success response ---
  return response.json();
}
