
const request = require('request-promise');

const getOptions = (target, req) => {
  const options = {
    uri: target + req.url,
    methid: req.method,
    headers: {
      'content-type': req.headers['content-type'],
      'authorization': req.headers['authorization'],
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

const proxyServer = (proxy, app) => {
  app.all(route, async (req, res, next) => {
    let response;
    try {
      reponse = await request(getOptions(proxy.target, req));
      res.status(response.statusCode).send(response.body)
    } catch(e) {
      res.status(response.statusCode).send(response.body);
    }
  });
};

module.exports = proxyServer;