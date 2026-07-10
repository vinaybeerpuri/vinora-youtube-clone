import API from "../config/api";

const AUTH_API = `${API}/api/auth`;

export const loginUser = async (data) => {

    const response = await fetch(
        `${AUTH_API}/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        }
    );

    return response.json();
};

export const registerUser = async (data) => {

    const response = await fetch(
        `${AUTH_API}/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        }
    );

    return response.json();
};