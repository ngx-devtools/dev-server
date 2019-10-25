# Development Server
Helps you quickly run your frontend code.

## Features
* Create express routes.
* serve static files
* connect to proxy api

## Usage

Install with npm

```
npm install @ngx-devtools/server --save-dev
```

## Steps
* Create index.js file in your project root folder
* Add following code: 
```js
  const { DevServer } = require('@ngx-devtools/server');
  
  DevServer.start();
```
* Add to your npm scripts
```json
  "scripts": {
    "start": "node ."
  }
```

## How to create your own Server
* Create `server` folder in your project root.
* Add start.js
* Add the following code
```js
const { Server } = require('@ngx-devtools/server');

/**
 *  use the custom configuration
 *  connect to the proxy servers
 *  add the folders as static folders
*/
const server = new Server({
  port: 4200, 
  host: 'localhost', 
  proxyServers: [
    { "route": "/api/users", "target": "http://localhost:5001" }
  ], 
  folders: [
    { "route": "", "root": true, "path": "dist" },
    { "route": "dist", "path": "dist" },
    { "route": "node_modules", "path": "node_modules" }
  ],
  routeDir: 'server'
});
server.listen();
```
* Create index.js file in your project root folder
* Add following code: 
```js
  const { DevServer } = require('@ngx-devtools/server');
  
  DevServer.start({
    path: 'server/start.js'
  });
```
* Add to your npm scripts
```json
  "scripts": {
    "start": "node ."
  }
```
