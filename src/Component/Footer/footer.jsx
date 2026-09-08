import { Link } from 'react-router-dom';
import { FaFilm, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const creatorName = "Jovan Sebastian William";
  const releaseYear = new Date().getFullYear();
  const appName = "Revlume"; 

  return (
    <footer className="w-full bg-[var(--surface-primary)] text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-16 pb-12 mt-20 relative z-20 transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Bagian Utama Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Kolom 1: Logo & Deskripsi */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[var(--primary-color,#3b82f6)] text-white rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <FaFilm size={24} />
              </div>
              <span className="text-2xl font-extrabold tracking-wider text-[var(--text-primary)]">
                {appName}
              </span>
            </div>
            <p className="text-sm md:text-base leading-relaxed max-w-sm text-[var(--text-secondary)]">
              Platform penjelajah film premium berbasis TMDB API. Temukan film trending, bioskop terbaru, dan daftar film favoritmu dengan pengalaman visual yang sinematik.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold text-base mb-4 tracking-wide uppercase text-xs">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link to="/movies" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200">Movies</Link>
              </li>
              <li>
                <Link to="/watchlist" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200">WatchList</Link>
              </li>
              <li>
                <Link to="/profile" className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors duration-200">Profile</Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Sosial Media / Kontak */}
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold text-base mb-4 tracking-wide uppercase text-xs">
              Terhubung
            </h3>
            <div className="flex items-center gap-3">
              {/* ✏️ BAGIAN YANG BISA DIUBAH: Link Sosial Media Kamu */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-[var(--surface-secondary)] hover:bg-[var(--primary-color)] text-[var(--text-secondary)] hover:text-white rounded-xl border border-[var(--border-subtle)] transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-[var(--surface-secondary)] hover:bg-[var(--primary-color)] text-[var(--text-secondary)] hover:text-white rounded-xl border border-[var(--border-subtle)] transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a 
                href="mailto:emailmu@example.com" 
                className="p-2.5 bg-[var(--surface-secondary)] hover:bg-[var(--primary-color)] text-[var(--text-secondary)] hover:text-white rounded-xl border border-[var(--border-subtle)] transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Email"
              >
                <FaEnvelope size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Garis Pembatas */}
        <div className="border-t border-[var(--border-subtle)] pt-8 flex flex-col md:flex-row items-center justify-between text-xs md:text-sm text-[var(--text-muted)] gap-4">
          
          {/* Copyright */}
          <p>
            © {releaseYear} <span className="text-[var(--text-secondary)] font-medium">{appName}</span>. All rights reserved.
          </p>

          {/* Info Pencipta Website */}
          <p className="flex items-center gap-1.5">
            Built & designed by <span className="text-[var(--primary-color,#3b82f6)] font-semibold">{creatorName}</span>
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;