import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Watchlist', path: '/watchlist' },
    { name: 'Search', path: '/search' },
    { name: 'Profile', path: '/profile' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#1A1A24]/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group outline-none">
            <span className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-[var(--primary-color,theme(colors.purple.500))] to-rose-400 bg-clip-text text-transparent drop-shadow-sm group-hover:drop-shadow-lg transition-all duration-300">
              M<span className="text-white">App</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-sm font-semibold tracking-wide transition-colors duration-300 py-2 outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {/* Active Indicator Underline */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--primary-color,theme(colors.purple.500))] rounded-t-full shadow-[0_-2px_10px_rgba(139,92,246,0.5)]"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary-color,theme(colors.purple.500))] transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out origin-top ${
          isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 absolute w-full'
        } bg-[#1A1A24]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1.5 sm:px-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-semibold tracking-wide transition-all duration-200 ${
                  isActive 
                    ? 'bg-[var(--primary-color,theme(colors.purple.600))]/20 text-[var(--primary-light,theme(colors.purple.300))] border border-[var(--primary-color)]/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
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
