const cache = new Map();

export const cacheMiddleware = (durationInSeconds) => {
    return (req, res, next) => {
        const key = req.originalUrl || req.url;
        const cachedResponse = cache.get(key);

        if (cachedResponse && cachedResponse.expires > Date.now()) {
            console.log(`Cache hit for ${key}`);
            return res.json(cachedResponse.data);
        }

        res.sendResponse = res.json;
        res.json = (body) => {
            cache.set(key, {
                data: body,
                expires: Date.now() + (durationInSeconds * 1000)
            });
            res.sendResponse(body);
        };

        next();
    };
};

export const clearCache = () => {
    cache.clear();
};
