import MovieCard from '../MovieCard/movieCard';

const MovieGrid = ({ movies, title }) => {
  // Menangani kondisi saat data film kosong atau belum ada (Loading/Empty State)
  if (!movies || movies.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="bg-[var(--surface-secondary)] p-6 rounded-full mb-6 shadow-lg border border-white/5">
          <svg className="w-12 h-12 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Tidak Ada Film Ditemukan</h3>
        <p className="text-gray-400 max-w-md text-sm md:text-base">
          Maaf, saat ini tidak ada data film yang bisa ditampilkan. Silakan coba kembali nanti atau ubah filter pencarian Anda.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      {/* Jika properti title diberikan (misal: "Film Populer"), tampilkan header */}
      {title && (
        <div className="mb-8 md:mb-10 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-white border-l-4 border-[var(--premium-color)] pl-4 tracking-wide uppercase text-sm md:text-base drop-shadow-sm">
            {title}
          </h2>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-[var(--border-strong)] to-transparent ml-6 opacity-50 hidden sm:block"></div>
        </div>
      )}
      
      {/* 
        Responsive Grid Layout - Clean & Premium:
        - 2 kolom pada mobile dengan gap proporsional
        - 3 kolom pada tablet
        - 4 kolom pada desktop
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieGrid;
