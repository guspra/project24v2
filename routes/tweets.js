const User = require('../models/user'); // Import User Model Schema
const Tweet = require('../models/tweet'); // Import Tweet Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {

  router.post('/xxx', (req, res) => {
    res.json('berhasil');
  });

  router.post('/newTweet', (req, res) => {
    console.log('newtweet di tweet route')
    // Check if tweet body was provided
    if (!req.body.body) {
      res.json({
        success: false,
        message: 'Tweet text is required.'
      }); // Return error message
    } else {
      // Check if tweet's creator was provided
      if (!req.body.createdBy) {
        res.json({
          success: false,
          message: 'Tweet creator is required.'
        }); // Return error
      } else {
        // Create the tweet object for insertion into database
        const tweet = new Tweet({
          body: req.body.body, // Body field
          createdBy: req.body.createdBy // CreatedBy field
        });
        // Save tweet into database
        tweet.save((err) => {
          // Check if error
          if (err) {
            // Check if error is a validation error
            if (err.errors) {

              // Check if validation error is in the body field
              if (err.errors.body) {
                res.json({
                  success: false,
                  message: err.errors.body.message
                }); // Return error message
              } else {
                res.json({
                  success: false,
                  message: err
                }); // Return general error message
              }

            } else {
              res.json({
                success: false,
                message: err
              }); // Return general error message
            }
          } else {
            res.json({
              success: true,
              message: 'Tweet saved!'
            }); // Return success message
          }
        });
      }
    }

  });

  /* ===============================================================
     GET ALL TWEETS
  =============================================================== */
  router.post('/allTweets', (req, res) => {
    console.log('getalltweet bro');
    // console.log(req.body);
    // Search database for all tweet posts
    Tweet.find({}, (err, tweets) => {
      // Check if error was found or not
      if (err) {
        res.json({
          success: false,
          message: err
        }); // Return error message
      } else {
        // Check if tweets were found in database
        if (!tweets) {
          res.json({
            success: false,
            message: 'No tweets found.'
          }); // Return error of no tweets found
        } else {
          res.json({
            success: true,
            tweets: tweets
          }); // Return success and tweets array
        }
      }
    }).sort({
      '_id': -1
    }).limit(req.body.tweetsLimit); // Sort tweets from newest to oldest
  });

  router.put('/likeTweet', (req, res) => {
    // res.json({
    //   id: req.body.id
    // });
    // console.log(req.decoded.userId);
    // console.log(req.body.tweetId);
    Tweet.findOne({
      _id: req.body.tweetId
    }, (err, tweet) => {
      // console.log(tweet);
      tweet.likedBy.push(req.body.usernameLike);
      tweet.save((err) => {
        if (err) {
          res.json({
            success: false,
            message: 'Something went wrong.'
          }); // Return error message
        } else {
          res.json({
            success: true,
            message: 'Tweet liked!'
          }); // Return success message
        }
      });
    });
  });

  router.put('/unlikeTweet', (req, res) => {
    Tweet.findOne({
      _id: req.body.tweetId
    }, (err, tweet) => {
      const index = tweet.likedBy.indexOf(req.body.usernameLike);
      tweet.likedBy.splice(index, 1);
      tweet.save((err) => {
        if (err) {
          res.json({
            success: false,
            message: 'Something went wrong.'
          }); // Return error message
        } else {
          res.json({
            success: true,
            message: 'Tweet unliked!'
          }); // Return success message
        }
      });
    });
  });

  router.post('/comment', (req, res) => {
    // console.log('tweet comment coy');
    // res.json('adfasdf');
    Tweet.findOne({
      _id: req.body.tweetId
    }, (err, tweet) => {
      // console.log(req.body.comment);
      tweet.comments.push(req.body.comment);
      tweet.save((err) => {
        if (err) {
          res.json({
            success: false,
            message: 'Something went wrong.'
          }); // Return error message
        } else {
          res.json({
            success: true,
            message: 'Comment Posted!'
          }); // Return success message
        }
      });
    });
  });


  return router;
};