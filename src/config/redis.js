const Redis = require('redis');

let redisClient = null;

const setupRedis = async () => {
    try {
        redisClient = Redis.createClient({
            url: process.env.REDIS_URL,
            socket: {
                tls: true,
                servername: 'redis-11866.c241.us-east-1-4.ec2.redns.redis-cloud.com',
                rejectUnauthorized: false,
                keepAlive: 0
            }
        });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
            console.log('Connected to Redis Cloud');
        });

        await redisClient.connect();
        console.log('Redis client connected successfully');
    } catch (error) {
        console.error('Redis connection error:', error);
        redisClient = null;
    }
};

// Wrapper for Redis operations
const redisWrapper = {
    async get(key) {
        if (!redisClient) return null;
        try {
            return await redisClient.get(key);
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    },

    async set(key, value, options = {}) {
        if (!redisClient) return;
        try {
            if (options.EX) {
                await redisClient.setEx(key, options.EX, value);
            } else {
                await redisClient.set(key, value);
            }
        } catch (error) {
            console.error('Redis set error:', error);
        }
    },

    async del(key) {
        if (!redisClient) return;
        try {
            await redisClient.del(key);
        } catch (error) {
            console.error('Redis del error:', error);
        }
    }
};

// Initialize Redis when this module is imported
setupRedis().catch(console.error);

module.exports = redisWrapper;
