import { RequestHandler, Router } from 'express';

interface RouterBuilderOptions {
  path: string;
  method: string;
  handler: RequestHandler
}

class RouterFactory {

  static create(options: RouterBuilderOptions) {
    const router = Router();
    return router[options.method](options.path, options.handler);
  }

}

export { RouterFactory, RouterBuilderOptions }