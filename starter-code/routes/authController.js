const express = require('express');
const authController = express.Router()
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

authController.get('/', (req, res, next) => {
  res.render('/login');
});

authController.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authController.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if ( username === "" || password === "") {
    res.render('auth/signup', {
      errorMessage: "Indicate a username and password to sign up"
    });
    return;
  }

  User
    .findOne({ "username": username })
    .exec((err, user) => {
      if (user) {
        res.render('auth/signup', {
          errorMessage: 'Username already exists'
        })
      } else {
          var salt = bcrypt.genSaltSync(bcryptSalt);
          var hashPass = bcrypt.hashSync(password, salt);

          var newUser = User({
            username: username,
            password: hashPass
          })

          newUser.save((err) => {
            if (err) {
              res.render('auth/signup', {
                errorMessage: 'Something when wrong when signing up'
              });
            } else {
              res.redirect('/login');
            }
          });
        }
    });
});

authController.get('/login', (req, res, next) => {
  res.render('auth/login')
})

authController.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.redirect('auth/login', {
      errorMessage: 'Username and password are both required to log in'
    });
    return;
  }

  User.findOne({ "username": username},
  "_id username password",
  (err, user) => {
    if (err || !user) {
      res.render('auth/login', {
        errorMessage: "User not found"
      });
      return;
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/private');
      } else {
        res.render('auth/login', {
          errorMessage: 'Incorrect password'
        });
      }
    }
  });
});

module.exports = authController;
