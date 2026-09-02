/**
 * ErrorMessage Component
 * Menampilkan pesan error dengan desain clean dan premium.
 * 
 * @param {string} message - Pesan error detail yang ingin ditampilkan.
 * @param {function} onRetry - Fungsi yang dijalankan ketika tombol retry ditekan.
 * @param {boolean} fullHeight - Jika true, komponen akan mengambil tinggi layar penuh atau parent (min-h-[50vh]).
 */
const ErrorMessage = ({ 
  message = "We encountered an unexpected error while trying to process your request.", 
  onRetry,
  fullHeight = true
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 sm:p-6 w-full ${fullHeight ? 'min-h-screen' : 'py-12'}`}>
      <div className="max-w-md w-full bg-[#1A1A24]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center text-center transition-all duration-300 hover:border-white/20">
        
        {/* Error Icon Wrapper */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          {/* Subtle glowing background */}
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
          
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-rose-600/10 border border-red-500/20 flex items-center justify-center shadow-inner">
            <svg 
              className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        </div>
        
        {/* Heading */}
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
          Something went wrong
        </h3>
        
        {/* Error Message */}
        <p className="text-gray-400 text-sm sm:text-base mb-8 leading-relaxed">
          {message}
        </p>
        
        {/* Retry Button */}
        <button 
          onClick={() => {
            if (onRetry) onRetry();
            window.location.reload();
          }}
          className="group relative flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-[var(--primary-color,theme(colors.purple.600))] hover:bg-[var(--primary-600,theme(colors.purple.500))] text-white rounded-xl font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-95 overflow-hidden isolate mt-2"
        >
          {/* Hover reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out z-10"></div>
          
          <svg 
            className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500 ease-in-out relative z-20" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2.5"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 22v-6h6"></path>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
          </svg>
          <span className="relative z-20">Try Again</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage
