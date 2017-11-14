const express = require('express');
const protectedController = express.Router();

protectedController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect('/login'); }
});

protectedController.get('/main', (req, res, next) => {
  res.render('protected/main');
});

protectedController.get('/private', (req, res, next) => {
  res.render('protected/private');
});


module.exports = protectedController;
