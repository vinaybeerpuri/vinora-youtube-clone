import { getUserProfile } from "./plans";

export const SOUTH_STATES = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];

export const isSouthIndia = (state = "") =>
  SOUTH_STATES.some((item) => item.toLowerCase() === state.toLowerCase());

export const getThemeForLogin = (profile = getUserProfile(), now = new Date()) => {
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hour = istTime.getHours();
  const minute = istTime.getMinutes();
  const minutes = hour * 60 + minute;
  const isMorningWindow = minutes >= 10 * 60 && minutes <= 12 * 60;

  return isMorningWindow && isSouthIndia(profile.state) ? "light" : "dark";
};

export const getOtpChannel = (state) => (isSouthIndia(state) ? "email" : "mobile");

export const fetchLocationProfile = async () => {
  const fallback = getUserProfile();

  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      ...fallback,
      city: data.city || fallback.city,
      state: data.region || fallback.state
    };
  } catch (error) {
    return fallback;
  }
};
