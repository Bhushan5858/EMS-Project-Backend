import redis from "../config/redis.js";

/**
 * Get data from cache
 * @param {string} key 
 * @returns {Promise<any>}
 */
export const getCache = async (key) => {
    try {
        const data = await redis.get(key);
        return data;
    } catch (error) {
        console.error(`Redis Get Error [${key}]:`, error);
        return null;
    }
};

/**
 * Set data to cache
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttl - Time to live in seconds (default 3600s / 1h)
 */
export const setCache = async (key, value, ttl = 3600) => {
    try {
        await redis.set(key, value, { ex: ttl });
    } catch (error) {
        console.error(`Redis Set Error [${key}]:`, error);
    }
};

/**
 * Delete data from cache
 * @param {string} key 
 */
export const delCache = async (key) => {
    try {
        await redis.del(key);
    } catch (error) {
        console.error(`Redis Del Error [${key}]:`, error);
    }
};
