const express = require('express');

const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();

async function checkHubId(req, res, next) {
  console.log('checking hub id')
  res.set('X-Lambda-Header', 'rocks')
  try {
    const hub = await Hubs.findById(req.params.id)
    if (hub) {
      req.hub = hub
      next()
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

router.get('/', (req, res) => {
  Hubs.find(req.query)
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the hubs',
      });
    });
});

router.get('/:id', checkHubId, (req, res) => {
  Hubs.findById(req.params.id)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: 'Hub not found' });
      }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the hub',
      });
    });
});

router.post('/', (req, res) => {
  Hubs.add(req.body)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error adding the hub',
      });
    });
});

router.delete('/:id', checkHubId, (req, res) => {
  Hubs.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The hub has been nuked' });
      } else {
        res.status(404).json({ message: 'The hub could not be found' });
      }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error removing the hub',
      });
    });
});

router.put('/:id', checkHubId, (req, res) => {
  Hubs.update(req.params.id, req.body)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: 'The hub could not be found' });
      }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error updating the hub',
      });
    });
});

router.get('/:id/messages', checkHubId, (req, res) => {
  Hubs.findHubMessages(req.params.id)
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error getting the messages for the hub',
      });
    });
});

router.post('/:id/messages', checkHubId, (req, res) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
    .then(message => {
      res.status(210).json(message);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error adding message to the hub',
      });
    });
});

module.exports = router;
