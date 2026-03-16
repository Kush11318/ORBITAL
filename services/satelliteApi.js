// =========================================
// TLE SATELLITE API SERVICE
// Base API: http://tle.ivanstanojevic.me/api/tle
// =========================================

const BASE_URL = 'https://tle.ivanstanojevic.me/api/tle';
const PROXY_URL = 'https://corsproxy.io/?';

/**
 * Searches for satellites by name using the TLE API.
 * Uses session storage for caching to avoid redundant requests.
 * @param {string} query - The name or partial name of the satellite (e.g., 'ISS')
 * @returns {Promise<Object>} The API response containing the 'member' array of satellite objects.
 */
export async function searchSatellites(query) {
    if (!query) return null;
    
    // Normalize query for cache key
    const normalizedQuery = query.trim().toLowerCase();
    const CACHE_KEY = `sat_search_${normalizedQuery}`;
    
    // Check cache
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    if (cachedData) {
        try {
            return JSON.parse(cachedData);
        } catch (e) {
            console.error("Error parsing cached satellite search data", e);
        }
    }

    try {
        // Use a high-reliability CORS proxy
        const targetUrl = `${BASE_URL}?search=${encodeURIComponent(query)}`;
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cache the successful response for the session
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        
        return data;
    } catch (error) {
        console.error(`Failed to search satellites for "${query}":`, error);
        throw error;
    }
}

/**
 * Fetches a specific satellite's precise TLE data by ID.
 * @param {number|string} id - The satellite catalog number.
 * @returns {Promise<Object>} The specific satellite data object.
 */
export async function getSatelliteById(id) {
    if (!id) return null;
    
    const CACHE_KEY = `sat_id_${id}`;
    
    // Check cache
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    if (cachedData) {
        try {
            return JSON.parse(cachedData);
        } catch (e) {
            console.error("Error parsing cached satellite ID data", e);
        }
    }

    try {
        const targetUrl = `${BASE_URL}/${id}`;
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cache the successful response
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        
        return data;
    } catch (error) {
        console.error(`Failed to fetch satellite ID "${id}":`, error);
        throw error;
    }
}
