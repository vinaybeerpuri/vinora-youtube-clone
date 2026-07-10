import API from "../config/api";

const COMMENT_API = `${API}/api/comments`;

export const getComments = async () => {

    const response =
        await fetch(COMMENT_API);

    return response.json();
};