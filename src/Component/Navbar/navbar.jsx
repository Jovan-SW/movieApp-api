import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/searchBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Watchlist', path: '/watchlist' }
  ];

  const handleSearch = (keyword) => {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
    setIsOpen(false);
    setIsMobileSearchOpen(false);
  };

  return (
    <>
      {/* Premium Navbar Styles */}
      <style>{`
        /* ─── Logo 3D Premium ─── */
        .revlume-logo {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0px;
          text-decoration: none;
          outline: none;
        }

        .revlume-logo .logo-text {
          font-size: clamp(1.35rem, 3.5vw, 1.75rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
          position: relative;

          /* 3D gradient */
          background: linear-gradient(
            145deg,
            #93c5fd 0%,
            #60a5fa 25%,
            #3b82f6 50%,
            #a5b4fc 70%,
            #e0f2fe 90%,
            #93c5fd 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;

          /* 3D text shadow illusion */
          filter:
            drop-shadow(0 1px 0px rgba(29, 78, 216, 0.9))
            drop-shadow(0 2px 0px rgba(29, 78, 216, 0.7))
            drop-shadow(0 3px 0px rgba(29, 78, 216, 0.4))
            drop-shadow(0 6px 18px rgba(59, 130, 246, 0.55))
            drop-shadow(0 12px 32px rgba(96, 165, 250, 0.25));

          transition: filter 0.35s ease, transform 0.35s ease, letter-spacing 0.35s ease;
          transform-style: preserve-3d;
        }

        .revlume-logo .logo-lume {
          -webkit-text-fill-color: transparent;
          background: linear-gradient(
            145deg,
            #f8fafc 0%,
            #e2e8f0 30%,
            #cbd5e1 60%,
            #f1f5f9 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          filter:
            drop-shadow(0 1px 0px rgba(255,255,255,0.35))
            drop-shadow(0 2px 0px rgba(148,163,184,0.5))
            drop-shadow(0 3px 0px rgba(71,85,105,0.4));
        }

        .revlume-logo:hover .logo-text {
          letter-spacing: -0.025em;
          filter:
            drop-shadow(0 1px 0px rgba(29, 78, 216, 1))
            drop-shadow(0 2px 0px rgba(29, 78, 216, 0.8))
            drop-shadow(0 4px 0px rgba(29, 78, 216, 0.5))
            drop-shadow(0 8px 24px rgba(59, 130, 246, 0.8))
            drop-shadow(0 16px 48px rgba(96, 165, 250, 0.45))
            drop-shadow(0 0px 60px rgba(147, 197, 253, 0.3));
          transform: translateY(-1px);
        }

        /* Shimmer animation on logo */
        .revlume-logo .logo-text::after {
          content: 'Revlume';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(255,255,255,0.55) 50%,
            transparent 70%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 100%;
          background-position: -100%;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }

        .revlume-logo:hover .logo-text::after {
          opacity: 1;
          animation: logoShimmer 0.6s ease forwards;
        }

        @keyframes logoShimmer {
          0%   { background-position: -100%; }
          100% { background-position: 200%; }
        }

        /* ─── Desktop Nav Link — Glow + Bottom Border ─── */
        .nav-link-desktop {
          position: relative;
          font-size: 0.9375rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          padding: 0.375rem 0.875rem;
          border-radius: 0.625rem;
          color: var(--text-secondary);
          transition:
            color 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease,
            transform 0.2s ease;
          outline: none;
          text-decoration: none;
          overflow: hidden;
        }

        /* Bottom border pseudo-element */
        .nav-link-desktop::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 70%;
          height: 1.5px;
          border-radius: 9999px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--primary-light),
            transparent
          );
          box-shadow: 0 0 8px 1px var(--primary-color);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
          opacity: 0;
        }

        /* Hover state */
        .nav-link-desktop:hover {
          color: var(--primary-light);
          background: rgba(59, 130, 246, 0.08);
          box-shadow:
            0 0 0 1px rgba(59, 130, 246, 0.15),
            0 0 14px 2px rgba(59, 130, 246, 0.12),
            0 4px 16px rgba(59, 130, 246, 0.1),
            inset 0 1px 0 rgba(147, 197, 253, 0.08);
          transform: translateY(-1px);
        }

        .nav-link-desktop:hover::after {
          transform: translateX(-50%) scaleX(1);
          opacity: 1;
        }

        /* Active state */
        .nav-link-desktop.active-link {
          color: var(--primary-light);
          background: rgba(59, 130, 246, 0.12);
          box-shadow:
            0 0 0 1px rgba(59, 130, 246, 0.22),
            0 0 18px 3px rgba(59, 130, 246, 0.18),
            0 4px 20px rgba(59, 130, 246, 0.14),
            inset 0 1px 0 rgba(147, 197, 253, 0.1);
        }

        .nav-link-desktop.active-link::after {
          transform: translateX(-50%) scaleX(1);
          opacity: 1;
        }

        /* Focus visible */
        .nav-link-desktop:focus-visible {
          box-shadow:
            0 0 0 2px rgba(59, 130, 246, 0.5),
            0 0 14px 2px rgba(59, 130, 246, 0.18);
        }

        /* ─── Mobile / Tablet Nav Link ─── */
        .nav-link-mobile {
          display: block;
          position: relative;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.9375rem;
          font-weight: 500;
          letter-spacing: 0.015em;
          color: var(--text-secondary);
          transition:
            color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.25s ease,
            padding-left 0.25s ease;
          text-decoration: none;
          outline: none;
          border-left: 2px solid transparent;
        }

        .nav-link-mobile::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%) scaleY(0);
          width: 2px;
          height: 55%;
          border-radius: 9999px;
          background: linear-gradient(180deg, var(--primary-light), var(--primary-color));
          box-shadow: 0 0 8px var(--primary-color);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nav-link-mobile:hover {
          color: var(--primary-light);
          background: rgba(59, 130, 246, 0.07);
          box-shadow:
            inset 0 0 20px rgba(59, 130, 246, 0.06),
            0 0 12px rgba(59, 130, 246, 0.08);
          padding-left: 1.25rem;
        }

        .nav-link-mobile:hover::before {
          transform: translateY(-50%) scaleY(1);
        }

        .nav-link-mobile.active-link {
          color: var(--primary-light);
          background: rgba(59, 130, 246, 0.1);
          padding-left: 1.25rem;
          box-shadow:
            inset 0 0 24px rgba(59, 130, 246, 0.08),
            0 0 14px rgba(59, 130, 246, 0.1);
        }

        .nav-link-mobile.active-link::before {
          transform: translateY(-50%) scaleY(1);
        }

        /* ─── Mobile Icon Buttons ─── */
        .mobile-icon-btn {
          padding: 0.5rem;
          border-radius: 0.625rem;
          color: var(--text-secondary);
          transition:
            color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.25s ease,
            transform 0.2s ease;
          outline: none;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .mobile-icon-btn:hover {
          color: var(--primary-light);
          background: rgba(59, 130, 246, 0.09);
          box-shadow:
            0 0 0 1px rgba(59, 130, 246, 0.15),
            0 0 12px rgba(59, 130, 246, 0.14),
            inset 0 1px 0 rgba(147, 197, 253, 0.06);
          transform: scale(1.05);
        }

        .mobile-icon-btn.active-icon {
          color: var(--primary-light);
          background: rgba(59, 130, 246, 0.12);
          box-shadow:
            0 0 0 1px rgba(59, 130, 246, 0.2),
            0 0 14px rgba(59, 130, 246, 0.18);
        }
      `}</style>

      <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--background-primary)]/85 backdrop-blur-2xl border-b border-[var(--border-subtle)] shadow-[0_1px_20px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* ─── Logo 3D Premium ─── */}
            <Link to="/" className="revlume-logo flex-shrink-0">
              <span className="logo-text">
                Rev<span className="logo-lume">lume</span>
              </span>
            </Link>

            {/* ─── Desktop Navigation ─── */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `nav-link-desktop${isActive ? ' active-link' : ''}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Search Bar Desktop */}
              <div className="w-72 xl:w-80 ml-3">
                <SearchBar onSearch={handleSearch} placeholder="Search movies..." />
              </div>

              {/* Profile Desktop */}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-link-desktop ml-1${isActive ? ' active-link' : ''}`
                }
              >
                Profile
              </NavLink>
            </div>

            {/* ─── Mobile Actions: Search, Profile, Hamburger ─── */}
            <div className="flex md:hidden items-center gap-0.5">
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="mobile-icon-btn"
                aria-label="Open search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link
                to="/profile"
                className="mobile-icon-btn"
                aria-label="Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="mobile-icon-btn"
                aria-label="Open main menu"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg className="block h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Mobile Full-Width Search Overlay ─── */}
        {isMobileSearchOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full h-16 bg-[var(--background-primary)] z-50 flex items-center px-4 border-b border-[var(--border-subtle)] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} placeholder="Search movies..." />
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="mobile-icon-btn ml-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* ─── Mobile Navigation Menu ─── */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out origin-top ${
            isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 absolute w-full'
          } bg-[var(--background-primary)]/95 backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-2xl`}
        >
          <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `nav-link-mobile${isActive ? ' active-link' : ''}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
