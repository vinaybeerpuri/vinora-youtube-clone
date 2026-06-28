const API = "http://localhost:5000/api/videos";

export const getVideos = async () => {

    const response =
        await fetch(API);

    return response.json();
};