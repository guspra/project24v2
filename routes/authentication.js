const User = require('../models/user');
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database');

module.exports = (router) => {

  router.post('/register', (req, res) => {
    console.log('masuk ke authentication');
    let email = req.body.email;
    //res.send('emailmu adalah: ' + email);
    // res.json(req.body);
    // res.send('emailmu adalah: '+email);
    // console.log(req);
    let user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    user.save((err) => {
      // res.json(err);
      if (err) {
        res.json({
          success: false,
          message: 'Oops! saving data error',
          babi: 'kucit!!',
          err
        });
      } else {
        res.json({
          success: true,
          message: 'Yeay! saving User data success',
          babi: 'celeng'
        });
      }

    })
    // res.json(user);
  })
  // console.log('masuk ke return router');

  router.get('/checkEmail/:email', (req, res) => {
    console.log('cek double email di authentication');
    // Check if email was provided in paramaters
    if (!req.params.email || req.params.email == ' ') {
      res.json({
        success: false,
        message: 'E-mail cannot be empty'
      }); // Return error
    } else {
      // Search for user's e-mail in database;
      User.findOne({
        email: req.params.email
      }, (err, user) => {
        if (err) {
          res.json({
            success: false,
            message: err
          }); // Return connection error
        } else {
          // Check if user's e-mail is taken
          if (user) {
            console.log('sudah ada emailnya di database! adalah: ' + req.params.email);
            res.json({
              success: false,
              message: 'E-mail is already registered'
            }); // Return as taken e-mail
          } else {
            console.log('emailnya sudah unik! adalah: ' + req.params.email);
            res.json({
              success: true,
              message: 'E-mail is available'
            }); // Return as available e-mail
          }
        }
      });
    }
  });


  router.get('/checkUsername/:username', (req, res) => {
    console.log('cek double username di authentication');
    // Check if email was provided in paramaters
    if (!req.params.username || req.params.username == ' ') {
      res.json({
        success: false,
        message: 'E-mail cannot be empty'
      }); // Return error
    } else {
      // Search for user's e-mail in database;
      User.findOne({
        username: req.params.username
      }, (err, user) => {
        if (err) {
          res.json({
            success: false,
            message: err
          }); // Return connection error
        } else {
          // Check if user's e-mail is taken
          if (user) {
            console.log('sudah ada usernamenya di database! adalah: ' + req.params.username);
            res.json({
              success: false,
              message: 'Username is already registered'
            }); // Return as taken e-mail
          } else {
            console.log('usernamenya sudah unik! adalah: ' + req.params.username);
            res.json({
              success: true,
              message: 'Username is available'
            }); // Return as available e-mail
          }
        }
      });
    }
  });

  router.post('/login', (req, res) => {
    // res.send('testtttt ' + req.body.username);
    User.findOne({
      username: req.body.username.toLowerCase()
    }, (err, user) => {
      let passwordCorrect = false;
      if (user) {
        passwordCorrect = user.comparePassword(req.body.password);
      }

      if (!passwordCorrect) {
        // res.send('invalid password');
        res.json({
          success: false,
          message: 'Username or Password is invalid'
        });
      } else {
        const token = jwt.sign({
          userId: user._id
        }, config.secret, {
          expiresIn: '24h'
        }); // Create a token for client
        res.json({
          success: true,
          message: 'Success!',
          token: token,
          userxxx: {
            jaran: 'goyang'
          },
          user: {
            username: user.username,
            email: user.email,
            babi: 'celeng'
          }
        });
      }
      // res.send(user);
    });
  });


  router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({
        success: false,
        message: 'No token provided'
      }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, config.secret, (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({
            success: false,
            message: 'Token invalid: ' + err
          }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });

  router.get('/profile', (req, res) => {
    // res.json('halooo');
    // res.send(req.decoded);
    console.log(req.decoded);
    console.log('ini profile coy');
    User.findOne({
      _id: req.decoded.userId
    }).select('username email').exec((err, user) => {
      // Check if error connecting
      if (err) {
        res.json({
          success: false,
          message: err
        }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({
            success: false,
            message: 'User not found'
          }); // Return error, user was not found in db
        } else {
          res.json({
            success: true,
            user: user
          }); // Return success, send user object to frontend for profile
        }
      }
    });
  });

  return router;
}