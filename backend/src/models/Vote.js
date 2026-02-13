const mongoose = require('mongoose');
const { Schema } = mongoose;

const voteSchema = new Schema({
  issueId: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['upvote', 'downvote'], default: 'upvote' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vote', voteSchema);


