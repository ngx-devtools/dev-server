const express = require('express');

const Response = {
  status (code = 200) {
    return this;
  },
  send (body = {}) {
    return this;
  },
  json (value) {
    return this;
  }
}

const ROUTE_METHOD = Object.freeze({
  GET: 'get',
  POST: 'post',
  UPDATE: 'update',
  DELETE: 'delete'
});

const createOptions = { 
  path: '/sample',
  method: 'get',
  handler:  async (req, res = Response, next) => { 
    return res.status(200).send({});
  }
};

const RouterFactory = {
  create (options = createOptions) {
    const router = express.Router();
    return router[options.method](options.path, options.handler);
  }
}

exports.RouterFactory = RouterFactory;
exports.ROUTE_METHOD = ROUTE_METHOD;