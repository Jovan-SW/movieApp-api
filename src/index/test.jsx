import { ErrorMessage } from '../Component/ErrorMessage/errorMessage';

// Contoh penggunaan saat terjadi error fetching data
export default function Test(){
    const isError = true;
    const fetchDataLagi = () => {
        console.log("fetchDataLagi");
    };
    
    if (isError) {
      return (
        <ErrorMessage 
          message="Gagal mengambil data dari server TMDB. Pastikan koneksi internet Anda stabil." 
          onRetry={() => fetchDataLagi()} 
        />
      )
    };

};
