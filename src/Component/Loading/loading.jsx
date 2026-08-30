
/**
 * Loading Spinner Component
 * @param {boolean} fullScreen - Jika true, spinner akan memenuhi layar (fixed).
 * @param {string} size - Ukuran spinner ('sm', 'md', 'lg').
 */
export const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* SVG Spinner for better rendering and custom colors */}
      <svg 
        className={`animate-spin text-[var(--primary-color,theme(colors.purple.500))] ${sizeClasses[size]}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="text-[var(--primary-light,theme(colors.gray.400))] font-medium animate-pulse text-sm">
        Loading data...
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0B10]/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full p-10">
      {spinner}
    </div>
  );
};

/**
 * Skeleton Component for a Single Movie Card
 */
export const MovieSkeleton = () => {
  return (
    <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-[#1A1A24] animate-pulse isolate shadow-lg">
      {/* Background Gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B10] via-[#0B0B10]/20 to-transparent opacity-80" />
      
      {/* Top right icon placeholders */}
      <div className="absolute top-3 right-3 flex flex-col gap-2.5">
        <div className="w-[34px] h-[34px] rounded-full bg-white/10 backdrop-blur-md" />
        <div className="w-[34px] h-[34px] rounded-full bg-white/10 backdrop-blur-md" />
      </div>

      {/* Bottom Content Placeholders */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-5">
        {/* Title Placeholder */}
        <div className="h-6 w-3/4 bg-white/20 rounded-md mb-2.5" />
        
        {/* Rating Placeholder */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/20 rounded-full" />
          <div className="h-4 w-10 bg-white/20 rounded-md" />
        </div>
      </div>
    </div>
  );
};

/**
 * Helper component to render a grid of MovieSkeletons
 * @param {number} count - Jumlah skeleton yang akan di-render.
 */
export const MovieGridSkeleton = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <MovieSkeleton key={i} />
      ))}
    </div>
  );
};
