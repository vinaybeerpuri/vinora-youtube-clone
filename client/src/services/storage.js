export const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

export const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const todayKey = () => new Date().toISOString().slice(0, 10);
