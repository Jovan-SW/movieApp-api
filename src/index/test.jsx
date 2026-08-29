import MovieGrid from '../Component/MovieGrid/movieGrid';

export default function TestGrid() {
  const daftarFilm = [
    { id: 1, title: "Inception", poster_path: "/9gk7adHYeDvHkYSz...jpg", rating: 8.8 },
    { id: 2, title: "Interstellar", poster_path: "/gEU2QniE6E77NI...jpg", rating: 8.6 },
    //... film lainnya
  ];

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <MovieGrid title="Rekomendasi Film" movies={daftarFilm} />
      
      {/* Jika Anda ingin mencoba tampilan saat kosong: */}
      {/* <MovieGrid title="Pencarian" movies={[]} /> */}
    </div>
  )
}
