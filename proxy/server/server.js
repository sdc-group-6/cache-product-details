const express = require('express');
const request = require('request');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
// const proxy = require('http-proxy-middleware');
const app = express();
const helpers = require('./helpers');
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  'allowedHeaders': ['Content-Type', 'Origin', 'Accept'],
  'origin': true,
}));

app.get('/loaderio-99c265e48b6d28302ba5702a64c1f0c5.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/loaderio-99c265e48b6d28302ba5702a64c1f0c5.txt'));
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const handleGetReq = (url) => {
  let cacheId = 'get' + url;
  return helpers.getCachedDataAsync(cacheId, cacheId).then((data) => {
    if (data.reply) {
      console.log('using cache');
      return data.reply;
    } else {
      return new Promise ((resolve, reject) => {
        request(`http://productDetailsLoadBalancer-2032199182.us-east-1.elb.amazonaws.com${url}`, (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            helpers.putInCacheAsync(data.passThrough, body);
            resolve(body);
          }
        });
      })
    }
  })
};

app.get('/shoes', (req, res) => {
  return handleGetReq('/shoes').then((shoes) => {
    res.status(200).send(shoes);
  }).catch((err) => {
    console.log(`There was an issue: ${err}`);
    res.status(503).send(err);
  })
});

app.get('/:shoeId', (req, res) => {
  let url = `/${req.params.shoeId}`;
  return handleGetReq(url).then((shoe) => {
    res.status(200).send(shoe);
  }).catch((err) => {
    console.log(`There was an issue: ${err}`);
    res.status(503).send(err);
  })
});

app.get('/shoes/:shoeId', (req, res) => {
  let url = `/shoes/${req.params.shoeId}`;
  return handleGetReq(url).then((shoe) => {
    res.status(200).send(shoe);
  }).catch((err) => {
    console.log(`There was an issue: ${err}`);
    res.status(503).send(err);
  })
});

app.get('/shares/:id', (req, res) => {
  let url = `/shares/${req.params.id}`;
  return handleGetReq(url).then((shares) => {
    res.status(200).send(shares);
  }).catch((err) => {
    console.log(`There was an issue: ${err}`);
    res.status(503).send(err);
  })
});



// app.use('/shoes',
//   proxy({
//     target: "http://ec2-54-91-175-206.compute-1.amazonaws.com:8001",
//     changeOrigin: true
//   })
// );

// app.use('/shoes/:shoeId',
//   proxy({
//     target: "http://ec2-54-91-175-206.compute-1.amazonaws.com:8001",
//     changeOrigin: true
//   })
// );

// app.use('/:shoeId',
//   proxy({
//     target: "http://ec2-54-91-175-206.compute-1.amazonaws.com:8001",
//     changeOrigin: true
//   })
// );

// app.use('/shares/:id',
//   proxy({
//     target: "http://ec2-54-91-175-206.compute-1.amazonaws.com:8001",
//     changeOrigin: true
//   })
// );

// app.use('/product',
//   proxy({
//     target: "http://ec2-54-91-175-206.compute-1.amazonaws.com:8001",
//     changeOrigin: true
//   })
// );

// app.use('/product/:id',
//   proxy({
//     target: "http://ec2-54-91-175-206.compute-1.amazonaws.com:8001",
//     changeOrigin: true
//   })
// );

// app.use('/products/:model',
//   proxy({
//     target: "http://127.0.0.1:8002",
//     changeOrigin: true
//   })
// );

// app.use('/images/:imageId',
//   proxy({
//     target: "http://127.0.0.1:8002",
//     changeOrigin: true
//   })
// );

// app.use('/reviews',
//   proxy({
//     target: "http://127.0.0.1:8003",
//     changeOrigin: true
//   })
// );

// app.get('/', (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// })

app.listen(port, () => {
  console.log(`Listening on server: https://localhost:${port}`);
});
