const express = require('express'); // importing a CommonJS module
const hubsRouter = require('./hubs/hubs-router.js');
const helmet = require('helmet');
const morgan = require('morgan');

const server = express();

server.use(express.json());
server.use('/api/hubs', hubsRouter);
server.get('/', helmet());
// server.use(morgan('dev'));
server.use(methodLogger);
server.use(addName);
// server.use(lockout);
server.use(timeout);

// SPECIFY which LOGGER will be used given METHOD
// server.get('/', morgan('dev'));
// server.delete('/', morgan('tiny'));

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
  `);
});

function methodLogger(req, res, next) {
  console.log(`${req.method} request`);
  next();
}

function addName(req, res, next) {
  req.name = req.name || 'wj';
  next();
}

function lockout(req, res, next) {
  res.status(403).json({ message: 'api in maintenance mode' })
}

function timeout(req, res, next) {
  let n = new Date().getSeconds();
  if (n % 3 === 0) {
    next({ code: 403, message: "you shall not pass" })
  } else {
    next();
  }
}

server.use((error, req, res, next) => {
  res.status(error.code).json({ message: "there was an error" , error })
})
module.exports = server;
