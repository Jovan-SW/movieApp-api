import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ─────────────────────────────────────────────
   Profile Page
   - Not logged in → shows guest view (login / register prompt)
   - Logged in     → shows user info card + logout button
───────────────────────────────────────────── */
export default function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  // While auth is resolving, show nothing (AuthProvider guards this at the root level,
  // but we keep a fallback here just in case)
  if (loading) return null;

  /* ─── GUEST VIEW ─── */
  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[var(--background-primary)] px-4">
        <div className="max-w-sm w-full text-center space-y-8 py-12 px-6">

          {/* Big avatar icon */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 blur-2xl scale-125" />
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[var(--background-secondary)] border-2 border-[var(--border-subtle)] flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-14 h-14 sm:w-16 sm:h-16 text-blue-400 opacity-80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              You're not logged in
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
             Log in to access your profile, save movies to your watchlist, and more.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            <Link
              to="/login"
              id="profile-login-btn"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_28px_rgba(59,130,246,0.55)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Log In
            </Link>

            <Link
              to="/register"
              id="profile-register-btn"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-[var(--text-primary)] bg-[var(--background-secondary)] border border-[var(--border-subtle)] hover:border-blue-500/50 hover:bg-blue-500/8 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─── LOGGED-IN VIEW ─── */
  const emailInitial = user.email?.[0]?.toUpperCase() ?? '?';
  const joinedAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[var(--background-primary)] px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">

        {/* ─── Avatar + Name Card ─── */}
        <div className="relative bg-[var(--background-secondary)] rounded-2xl border border-[var(--border-subtle)] p-6 sm:p-8 overflow-hidden text-center shadow-xl">
          {/* Background glow blobs */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 pointer-events-none" />

          {/* Avatar circle */}
          <div className="relative flex justify-center mb-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-25 blur-2xl scale-110" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.35)] ring-4 ring-blue-500/20">
                <span className="text-3xl sm:text-4xl font-extrabold text-white select-none">
                  {emailInitial}
                </span>
              </div>
            </div>
          </div>

          {/* Email */}
          <h1 className="relative text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight truncate max-w-full">
            {user.email}
          </h1>

          {/* User ID */}
          <p className="relative mt-1 text-xs text-[var(--text-secondary)] font-mono break-all opacity-60">
            ID: {user.id}
          </p>

          {/* Joined date */}
          {joinedAt && (
            <p className="relative mt-3 text-sm text-[var(--text-secondary)]">
              <span className="opacity-60">Member since</span>{' '}
              <span className="font-medium text-[var(--text-primary)]">{joinedAt}</span>
            </p>
          )}
        </div>

        {/* ─── Account Details Card ─── */}
        <div className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)] shadow-lg overflow-hidden">
          <div className="px-5 py-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-0.5">Email</p>
            <p className="text-sm sm:text-base text-[var(--text-primary)] font-medium break-all">{user.email}</p>
          </div>
          <div className="px-5 py-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-0.5">Account Status</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <p className="text-sm sm:text-base text-emerald-400 font-medium">Active</p>
            </div>
          </div>
          {joinedAt && (
            <div className="px-5 py-4 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-0.5">Member Since</p>
              <p className="text-sm sm:text-base text-[var(--text-primary)] font-medium">{joinedAt}</p>
            </div>
          )}
        </div>

        {/* ─── Logout Button ─── */}
        <button
          id="profile-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-semibold text-red-400 bg-red-500/8 border border-red-500/25 hover:bg-red-500/15 hover:border-red-500/50 transition-all duration-200 shadow-sm hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>

      </div>
    </div>
  );
}