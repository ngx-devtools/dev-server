import request, { CoreOptions, UriOptions } from 'request';
import { Application, Request, Response } from 'express';
import { extname } from 'path';
import * as url from 'url';

const mime = require('mime');

enum HTTP_METHOD {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PUT = 'put'
}

interface RequestOptions extends CoreOptions, UriOptions { 
  contentType?: string;
}

interface ProxyRequestOptions extends Request { 
  body: Body;
  query: any;
}

interface ProxyServer {
  target: string;
  route: string;
}

class Proxy {

  private _app: Application;

  constructor(app: Application) {
    this._app = app;
  }

  add(proxy: ProxyServer){
    this._app.all(proxy.route, async function(req: Request, res: Response, next: any) {
      const options =  Proxy.createOptions(proxy.target, req);
      const response = await Proxy.requireAsync(options);
      if (response.error) return res.status(response.statusCode).send(response.error);
      if (options.contentType) res.contentType(options.contentType);
      return res.status(response.statusCode).send(response.body);
    });
  }

  private static requireAsync(options: RequestOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      request(options, (error: any, response: any, body: any) => {
        if (error) reject({ error: error, statusCode: response.statusCode });
        resolve({ error: error, statusCode: response.statusCode, body: body, response: response });
      });
    });
  }

  private static createOptions(target: string, req: ProxyRequestOptions) {
    const options: RequestOptions = {
      uri: target + req.url,
      method: req.method,
      headers: {
        'content-type': 'application/json',
        'accept': req.headers['accept']
      }
    }
    switch(req.method.toLocaleLowerCase()) {
      case HTTP_METHOD.POST: 
      case HTTP_METHOD.PUT:
        options.body = req.body;
      break;
      case HTTP_METHOD.GET:
      if (Object.keys(req.query).length > 0) {
        options.uri = `${target}${req.url.split('?')[0]}`;
        options.qs = req.query;
      }
      break;  
    }
    const { pathname } = url.parse(options.uri as string);
    const extName = extname(pathname.split('/').pop());
    if ('.jpg .jpeg .png .woff .woff2'.includes(extName)) {
      options.encoding = null;
    }
    if ('.svg'.includes(extName)) {
      options.contentType = mime.lookup(extName.replace('.', ''));
    }
    return options;
  }

}

export { Proxy, ProxyServer, HTTP_METHOD, RequestOptions, ProxyRequestOptions }