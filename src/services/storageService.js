const STORAGE_PREFIX = 'geo_sales_mvp';

export function loadState(key, fallbackValue) {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch (error) {
    console.warn(`Failed to load local state for ${key}`, error);
    return fallbackValue;
  }
}

export function saveState(key, value) {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save local state for ${key}`, error);
  }
}
