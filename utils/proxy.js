
const request = require('request');

const getOptions = (target, req) => {
  const options = {
    uri: target + req.url,
    methid: req.method,
    headers: {
      'content-type': 'application/json',
      'accept': req.headers['accept']
    },
    resolveWithFullResponse: true
  };
  switch(req.method.toLocaleLowerCase()) {
    case 'post': 
    case 'put':
      options.json = true;
      options.body = req.body
      break;
    case 'get': 
      if (Object.keys(req.query).length > 0) {
        options.uri = `${target}${req.url.split('?')[0]}`;
        options.qs = req.query;
      }
      break;  
  }
  return options;
};

const requestAsync = (options) => {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) reject({ error: error, statusCode: response.statusCode });
      resolve({ error: error, statusCode: response.statusCode, body: body });
    });
  });
};

const proxyServer = (proxy, app) => {
  app.all(proxy.route, async(req, res, next) => {
    const response = await requestAsync(getOptions(proxy.target, req));
    if (response.error) return res.status(response.statusCode).send(response.error);
    return res.status(response.statusCode).send(response.body);
  });
};

module.exports = proxyServer;