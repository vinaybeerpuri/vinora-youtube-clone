import API from "../config/api";

const VIDEO_API = `${API}/api/videos`;

export const getVideos = async () => {

    const response =
        await fetch(VIDEO_API);

    return response.json();
};