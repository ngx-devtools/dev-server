import { ProxyServer } from './proxy';

interface StaticFolder {
  route: string;
  root?: boolean;
  path: string;
}

interface ServerOptions {
  port?: number;
  host?: string;
  proxyServers?: ProxyServer[];
  folders?: StaticFolder[];
  routeDir?: string;
}

const ServerDefaultOptions: ServerOptions = {
  port: 4000, 
  host: 'localhost', 
  proxyServers: [], 
  folders: [
    { "route": "", "root": true, "path": "dist" },
    { "route": "dist", "path": "dist" },
    { "route": "node_modules", "path": "node_modules" }
  ],
  routeDir: 'server'
}

export { ServerOptions, ServerDefaultOptions, StaticFolder }