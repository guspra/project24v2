const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;


// Blog Model Definition
const conversationSchema = new Schema({
  userIdConcat: {
    type: String,
    required: true,
    unique: true
  }
  userId1: {
    type: String,
    required: true
  }
  userId2: {
    type: String,
    required: true
  },
  conversations: [{
    senderId: {
      type: String
    },
    message: {
      type: String
    },
    sentAt: {
      type: Date,
      default: Date.now()
    }
  }]
});

// Export Module/Schema
module.exports = mongoose.model('Conversation', conversationSchema);