import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../Component/Navbar/navbar";

import Home from "../Pages/Home/Home"
import Movies from "../Pages/Movies/Movies"
import WatchList from "../Pages/WatchList/WatchList"
// import Search from "../Pages/Search/Search"
import Profile from "../Pages/Profile/Profile"
import MovieDetail from "../Pages/MovieDetail/movieDetail"
import Login from "../Pages/Login/Login"
import Register from "../Pages/Register/Register"
import { AuthProvider } from "../context/AuthContext"
import ProtectedRoute from "../Component/ProtectedRoute/ProtectedRoute"
import { useAuth } from "../context/AuthContext"

// Redirect already-authenticated users away from login/register
function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default function App(){

  return(
    <>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route
              path="/watchlist"
              element={
                <ProtectedRoute>
                  <WatchList />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/search" element={<Search />} /> */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}