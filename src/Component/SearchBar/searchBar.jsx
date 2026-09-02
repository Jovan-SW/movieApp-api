import { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search for movies..." }) => {
  const [keyword, setKeyword] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && keyword.trim() !== '') {
      if (typeof onSearch === 'function'){
        onSearch(keyword.trim());
      } else if (typeof onSearch === 'string') {
        onSearch(keyword.trim());
      }
    }
  };

  const handleSearchClick = () => {
    if (keyword.trim() !== '') {
      if (typeof onSearch === 'function'){
        onSearch(keyword.trim());
    }
  }
};

  return (
    <div className="relative w-full max-w-none mx-auto">
      <div className="relative flex items-center w-full h-10 rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] focus-within:bg-[var(--surface-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--primary-color)]/40 focus-within:border-[var(--primary-color)]/60 transition-all duration-200 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]">
        <button 
          onClick={handleSearchClick}
          className="grid place-items-center h-8 w-8 ml-1 rounded-md text-[var(--text-muted)] hover:text-[var(--primary-light)] hover:bg-[var(--primary-color)]/10 transition-all duration-200 outline-none"
          aria-label="Search"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2.5" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>
        <input
          className="peer h-full w-full outline-none text-sm text-[var(--text-primary)] bg-transparent pl-2 pr-4 placeholder-[var(--text-muted)] font-normal"
          type="text"
          placeholder={placeholder}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};


export default SearchBar;
