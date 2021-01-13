const express = require('express');

const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();

const { checkHubId, checkNewHub } = require('../middleware')

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
  res.status(200).json(req.hub)
});

router.post('/', checkNewHub,(req, res) => { // { name }
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
      res.status(200).json({ message: 'The hub has been nuked' });
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
  //here 
  Hubs.update(req.params.id, req.body)
    .then(hub => {
      res.status(200).json(hub);
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
