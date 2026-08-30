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
    <nav className="fixed top-0 left-0 w-full z-50 bg-[var(--background-primary)]/85 backdrop-blur-2xl border-b border-[var(--border-subtle)] shadow-[0_1px_20px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group outline-none">
            <span className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-light)] bg-clip-text text-transparent drop-shadow-sm group-hover:drop-shadow-lg transition-all duration-300">
              Rev<span className="text-white">lume</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-base font-medium tracking-wide transition-all duration-200 px-3 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]/50 rounded-lg ${
                    isActive
                      ? 'text-[var(--primary-light)] bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20'
                      : 'text-[var(--text-secondary)] hover:text-[var(--primary-light)] hover:bg-[var(--primary-color)]/10'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            {/* Search Bar Desktop */}
            <div className="w-72 xl:w-80 ml-2">
              <SearchBar onSearch={handleSearch} placeholder="Search movies..." />
            </div>

            {/* Profile Desktop */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `relative text-base font-medium tracking-wide transition-all duration-200 px-3 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]/50 rounded-lg ml-2 ${
                  isActive
                    ? 'text-[var(--primary-light)] bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20'
                    : 'text-[var(--text-secondary)] hover:text-[var(--primary-light)] hover:bg-[var(--primary-color)]/10'
                }`
              }
            >
              Profile
            </NavLink>
          </div>

          {/* Mobile Actions: Search, Profile, Hamburger */}
          <div className="flex md:hidden items-center gap-0.5">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary-light)] hover:bg-[var(--primary-color)]/10 transition-all duration-200 focus:outline-none"
              aria-label="Open search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link
              to="/profile"
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary-light)] hover:bg-[var(--primary-color)]/10 transition-all duration-200 focus:outline-none"
              aria-label="Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary-light)] hover:bg-[var(--primary-color)]/10 transition-all duration-200 focus:outline-none"
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

      {/* Mobile Full-Width Search Overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-16 bg-[var(--background-primary)] z-50 flex items-center px-4 border-b border-[var(--border-subtle)] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} placeholder="Search movies..." />
          </div>
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="ml-3 p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary-light)] hover:bg-[var(--primary-color)]/10 transition-all duration-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile Navigation Menu */}
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
                `block px-4 py-3 rounded-xl text-base font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--primary-color)]/15 text-[var(--primary-light)] border border-[var(--primary-color)]/25'
                    : 'text-[var(--text-secondary)] hover:text-[var(--primary-light)] hover:bg-[var(--primary-color)]/10'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
