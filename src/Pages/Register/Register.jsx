import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      setErrorMsg(error.message);
      setGoogleLoading(false);
    }
  };

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { data, error } = await register(email, password);

    if (error) {
      setErrorMsg(error);
      setLoading(false);
    } else {
      // Supabase may require email confirmation. Check if session exists.
      if (data?.session) {
        // Logged in immediately → redirect
        navigate('/');
      } else {
        // Email confirmation required
        setSuccessMsg('Account created! Please check your email to confirm your account, then sign in.');
        setLoading(false);
      }
    }
  };

  // Reusable eye toggle icon
  const EyeIcon = ({ visible }) =>
    visible ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    );

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-[var(--background-primary)] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[var(--background-secondary)] p-8 sm:p-10 rounded-2xl shadow-2xl border border-[var(--border-subtle)] relative overflow-hidden">

        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

        <div className="relative z-10 text-center">
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Create Account
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Join us to save your favorite movies and more.
          </p>
        </div>

        <form className="relative z-10 mt-8 space-y-5" onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-lg text-sm text-center">
              {successMsg}
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1" htmlFor="register-email">
                Email address
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 bg-[var(--background-primary)] border border-[var(--border-subtle)] placeholder-[var(--text-muted)] text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            {/* Password with show/hide */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1" htmlFor="register-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 pr-12 bg-[var(--background-primary)] border border-[var(--border-subtle)] placeholder-[var(--text-muted)] text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Create a password (min 6 chars)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--text-secondary)] hover:text-purple-400 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {/* Confirm Password with show/hide */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1" htmlFor="register-confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 pr-12 bg-[var(--background-primary)] border border-[var(--border-subtle)] placeholder-[var(--text-muted)] text-[var(--text-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--text-secondary)] hover:text-purple-400 transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <EyeIcon visible={showConfirmPassword} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading || !!successMsg}
              className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative z-10 mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-subtle)]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[var(--background-secondary)] text-[var(--text-secondary)]">
              or continue with
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <div className="relative z-10 mt-5">
          <button
            id="google-register-btn"
            type="button"
            disabled={googleLoading || loading || !!successMsg}
            onClick={handleGoogleLogin}
            className="group relative w-full flex justify-center items-center gap-3 py-3.5 px-4 border border-[var(--border-subtle)] text-sm font-semibold rounded-xl text-[var(--text-primary)] bg-[var(--background-primary)] hover:bg-[var(--background-secondary)] hover:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <svg className="animate-spin h-5 w-5 text-[var(--text-secondary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>

        <div className="relative z-10 mt-6 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
