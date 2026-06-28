import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Comments from "../components/Comments";
import UpgradePlans from "../components/UpgradePlans";
import VideoPlayer from "../components/VideoPlayer";
import videos from "../data/videos";

const Watch = () => {
  const { id } = useParams();
  const [showComments, setShowComments] = useState(true);
  const [showPlans, setShowPlans] = useState(false);
  const video = videos.find((item) => item.id === Number(id)) || videos[0];

  return (
    <main className="watch-page">
      <div className="watch-main">
        <VideoPlayer
          video={video}
          videos={videos}
          onOpenComments={() => setShowComments(true)}
          onNeedUpgrade={() => setShowPlans(true)}
        />
        <h1>{video.title}</h1>
        <p>{video.channel}</p>
        {showPlans && <UpgradePlans compact onUpgrade={() => setShowPlans(false)} />}
        <Comments open={showComments} />
      </div>

      <aside className="suggestions">
        <div className="section-heading">
          <h2>Suggested</h2>
          <button onClick={() => setShowComments((value) => !value)}>
            {showComments ? "Hide Comments" : "Show Comments"}
          </button>
        </div>
        {videos.map((item) => (
          <Link className="suggestion" key={item.id} to={`/watch/${item.id}`}>
            <img src={item.thumbnail} alt={item.title} />
            <span>{item.title}</span>
          </Link>
        ))}
      </aside>
    </main>
  );
};

export default Watch;
