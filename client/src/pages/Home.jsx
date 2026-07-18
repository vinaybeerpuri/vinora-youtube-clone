import API from "../config/api";
import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import "./Home.css";

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log("API =", API);

        const response = await fetch(`${API}/api/videos`);

        const data = await response.json();

        console.log("API RESPONSE:", data);

        setVideos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Video Fetch Error:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="home-page">
      <Navbar />

      <div className="home-body">
        <Sidebar />

        <main className="home-main">
          <h1 className="home-heading">Recommended Videos</h1>

          {videos.length === 0 ? (
            <h3 className="home-empty">No videos available</h3>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px" }}>              {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;