const redis = require('redis');
const frontCache = redis.createClient();

frontCache.on('connect', function() {
  console.log('Redis client connected');
});

frontCache.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

module.exports = frontCache;