import axios from 'axios';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const REQUEST_DELAY = 1000; // 1 second between requests (Nominatim policy)
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Rate Limiter class to comply with Nominatim's 1 request/second policy
 */
class RateLimiter {
  constructor(delayMs) {
    this.delayMs = delayMs;
    this.lastRequestTime = 0;
  }

  async wait() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.delayMs) {
      const waitTime = this.delayMs - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }
}

const rateLimiter = new RateLimiter(REQUEST_DELAY);

// Simple in-memory cache
const geocodeCache = new Map();

/**
 * Generate cache key from coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Cache key
 */
const getCacheKey = (lat, lng) => `${lat.toFixed(7)},${lng.toFixed(7)}`;

/**
 * Check if cached result is still valid
 * @param {object} cacheEntry - Cached entry
 * @returns {boolean} True if cache is valid
 */
const isCacheValid = (cacheEntry) => {
  if (!cacheEntry) return false;
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
};

/**
 * Format address for Mexican context
 * @param {object} data - Nominatim response data
 * @returns {string} Formatted address
 */
const formatMexicanAddress = (data) => {
  const addr = data.address;
  const parts = [];

  // Street with number
  if (addr.road) {
    const street = addr.road;
    const houseNumber = addr.house_number || '';
    parts.push(houseNumber ? `${street} ${houseNumber}` : street);
  }

  // Neighborhood/Suburb
  if (addr.neighbourhood || addr.suburb) {
    parts.push(addr.neighbourhood || addr.suburb);
  }

  // City/Town/Village
  if (addr.city || addr.town || addr.village || addr.municipality) {
    parts.push(addr.city || addr.town || addr.village || addr.municipality);
  }

  // State
  if (addr.state) {
    parts.push(addr.state);
  }

  // If we have parts, join them
  if (parts.length > 0) {
    return parts.join(', ');
  }

  // Fallback to display_name
  return data.display_name || 'Ubicación desconocida';
};

/**
 * Reverse geocode coordinates to address using Nominatim API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Formatted address
 */
export const reverseGeocode = async (lat, lng) => {
  // Check cache first
  const cacheKey = getCacheKey(lat, lng);
  const cached = geocodeCache.get(cacheKey);

  if (isCacheValid(cached)) {
    console.log('Returning cached address for:', cacheKey);
    return cached.address;
  }

  try {
    // Respect rate limit
    await rateLimiter.wait();

    // Make request to Nominatim
    const response = await axios.get(`${NOMINATIM_URL}/reverse`, {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1,
        'accept-language': 'es', // Spanish for Mexico
      },
      headers: {
        'User-Agent': 'ViajesApp/1.0 (Ride-sharing app for Mexico)',
      },
      timeout: 10000, // 10 second timeout
    });

    if (response.data && response.data.address) {
      const formattedAddress = formatMexicanAddress(response.data);

      // Cache the result
      geocodeCache.set(cacheKey, {
        address: formattedAddress,
        timestamp: Date.now(),
      });

      return formattedAddress;
    }

    // No address found, return coordinates
    throw new Error('No address found');
  } catch (error) {
    console.warn('Geocoding error:', error.message);

    // Return fallback with coordinates
    return `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

/**
 * Clear the geocoding cache (useful for testing or memory management)
 */
export const clearCache = () => {
  geocodeCache.clear();
};

/**
 * Get cache statistics
 * @returns {object} Cache statistics
 */
export const getCacheStats = () => {
  return {
    size: geocodeCache.size,
    entries: Array.from(geocodeCache.entries()).map(([key, value]) => ({
      coordinates: key,
      address: value.address,
      age: Date.now() - value.timestamp,
    })),
  };
};
