const Hubs = require('../hubs/hubs-model.js');

async function checkHubId(req, res, next) {
  console.log('checking hub id')
  res.set('X-Lambda-Header', 'rocks')
  try {
    const hub = await Hubs.findById(req.params.id)
    if (hub) {
      req.hub = hub
      next()
    } else {
      res.status(404).json(`hub with id ${req.params.id} not found`)
    }
  } catch (error) {
    res.status(500).json('ouch')
  }
  // inside middlewares we have access to req and res objects
  // here we can query db, modify request, validate request...

  // after we are done we make a choice:
  //  - allow the request to proceed to the next middleware
  //  - or send a response to the client
}

module.exports = checkHubId
