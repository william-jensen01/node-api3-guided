const express = require('express'); // importing a CommonJS module
const helmet = require('helmet')
const cors = require('cors')
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

server.use(express.json());
server.use(helmet())
server.use((req, res, next) => {
  console.log('welcome to my app')
  next()
  // CAREFUL!!!!!!!

  // 1- order of USAGE middlewares is important
  // 2- do not send back a response twice by accident:

  // if (true) {
  //   res.json('you can not go any further')
  // }
  // res.json('you can not go any further')
})

const hubsRouterPipeline = [logger, logger, logger]

server.use('/api/hubs', hubsRouterPipeline , hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
  `);
});

module.exports = server;

function logger(req, res, next) {
  console.log('falling into hubs router')
  next()
}
