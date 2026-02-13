const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
  category: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  attachments: [{ type: Schema.Types.ObjectId, ref: 'Attachment' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

issueSchema.index({ location: '2dsphere' });

issueSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Issue', issueSchema);


