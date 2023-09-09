const APIServer = require('./modules/apiServer/apiServer');

const server = new APIServer();
server.start(3000);
