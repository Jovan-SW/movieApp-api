import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../Component/Navbar/navbar";

import Home from "../Pages/Home/Home"
import Movies from "../Pages/Movies/Movies"
import WatchList from "../Pages/WatchList/WatchList"
import Search from "../Pages/Search/Search"
import Profile from "../Pages/Profile/Profile"

import MovieDetail from "../Pages/MovieDetail/movieDetail"

export default function App(){

  return(
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/watchlist" element={<WatchList />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}