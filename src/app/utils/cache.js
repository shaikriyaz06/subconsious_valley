const cache = new Map();

export const getCachedData = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  
  return item;
};

export const setCachedData = (key, data, etag = null, ttlMinutes = 10) => {
  cache.set(key, {
    data,
    etag,
    expiry: Date.now() + (ttlMinutes * 60 * 1000)
  });
};

export const fetchWithCache = async (url, cacheKey, ttlMinutes = 10) => {
  const cached = getCachedData(cacheKey);
  
  // If cache is still valid (not expired), return cached data immediately
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }
  
  // Cache expired or doesn't exist, make API call with ETag
  const headers = {};
  if (cached?.etag) {
    headers['If-None-Match'] = cached.etag;
  }
  
  const response = await fetch(url, { headers });
  
  if (response.status === 304) {
    // Not modified, extend cache expiry and return cached data
    setCachedData(cacheKey, cached.data, cached.etag, ttlMinutes);
    return cached.data;
  }
  
  const data = await response.json();
  const etag = response.headers.get('etag');
  
  setCachedData(cacheKey, data, etag, ttlMinutes);
  return data;
};