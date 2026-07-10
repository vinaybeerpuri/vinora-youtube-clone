import { PlayerProvider } from "./context/PlayerContext";
import MiniPlayer from "./components/MiniPlayer";
import { Routes, Route } from "react-router-dom";
import BottomNavbar from "./components/BottomNavbar";
import MobileTopBar from "./components/MobileTopBar";
import PlayerContainer from "./components/PlayerContainer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Premium from "./pages/Premium";
import Register from "./pages/Register";
import Downloads from "./pages/Downloads";
import VideoPlayer from "./components/VideoPlayer";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import UploadVideo from "./pages/UploadVideo";
import EditVideo from "./pages/EditVideo";

function App() {
  return (
    <PlayerProvider>

      <MobileTopBar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/premium"
          element={
            <PrivateRoute>
              <Premium />
            </PrivateRoute>
          }
        />

        <Route
          path="/search"
          element={<Search />}
        />

        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/video/:id"
          element={<VideoPlayer />}
        />

        <Route
          path="/upload"
          element={<UploadVideo />}
        />

        <Route
          path="/edit-video/:id"
          element={
            <PrivateRoute>
              <EditVideo />
            </PrivateRoute>
          }
        />

        <Route
          path="/downloads"
          element={
            <PrivateRoute>
              <Downloads />
            </PrivateRoute>
          }
        />

      </Routes>

      <BottomNavbar />
      <PlayerContainer />

      <MiniPlayer />

    </PlayerProvider>
  );
}

export default App;