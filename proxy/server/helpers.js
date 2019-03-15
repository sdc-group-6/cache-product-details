const frontCache = require('./indexRedis.js');

module.exports = {

  putInCacheAsync: (key, data, passThrough) => {
    return new Promise((resolve, reject) => {
      let storedValues = JSON.stringify(data);
      frontCache.set(key, storedValues, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          if (passThrough) {
            resolve({ reply, passThrough });
          }
          resolve({ reply} );
        }
      });
    });
  },

  getCachedDataAsync: (key, passThrough) => {
    return new Promise((resolve, reject) => {
      frontCache.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          reply = JSON.parse(reply);
          if (passThrough) {
            resolve({ reply, passThrough });
          } else {
            resolve({ reply });
          }
        }
      });
    });
  },



};