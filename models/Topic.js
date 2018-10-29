const mongoose = require('mongoose');
const { Schema } = mongoose;

const TopicSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  avatar: {
    type: String
  }
});

module.exports = mongoose.model('topics', TopicSchema);
