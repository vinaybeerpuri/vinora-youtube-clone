const API =
    "http://localhost:5000/api/comments";

export const getComments = async () => {

    const response =
        await fetch(API);

    return response.json();
};