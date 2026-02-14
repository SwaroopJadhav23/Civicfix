const bcrypt = require('bcryptjs');
const connectDatabase = require('../config/db');
const User = require('../models/User');
const Issue = require('../models/Issue');
const Comment = require('../models/Comment');
const Attachment = require('../models/Attachment');

async function seed() {
  try {
    await connectDatabase();
    console.log('Seeding database...');

    // clear minimal collections (be careful in production!)
    await Promise.all([
      User.deleteMany({}),
      Issue.deleteMany({}),
      Comment.deleteMany({}),
      Attachment.deleteMany({})
    ]);

    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('adminpass', salt);
    const userPass = await bcrypt.hash('userpass', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@civicfix.local',
      passwordHash: adminPass,
      role: 'admin'
    });

    const user1 = await User.create({
      name: 'Sample Citizen',
      email: 'citizen1@civicfix.local',
      passwordHash: userPass,
      role: 'user'
    });

    const issue1 = await Issue.create({
      title: 'Sample pothole',
      description: 'Pothole near central park',
      reporterId: user1._id,
      status: 'open',
      category: 'pothole',
      priority: 'high',
      location: { type: 'Point', coordinates: [85.3096, 23.3441] }
    });

    const comment1 = await Comment.create({
      issueId: issue1._id,
      authorId: admin._id,
      body: 'We have assigned a team to inspect this.'
    });

    const attachment1 = await Attachment.create({
      issueId: issue1._id,
      filename: 'pothole.jpg',
      url: '/uploads/sample-pothole.jpg',
      mimeType: 'image/jpeg',
      uploadedBy: user1._id
    });

    issue1.attachments = [attachment1._id];
    await issue1.save();

    console.log('Seed completed:');
    console.log('Users:', await User.countDocuments());
    console.log('Issues:', await Issue.countDocuments());
    console.log('Comments:', await Comment.countDocuments());
    console.log('Attachments:', await Attachment.countDocuments());

    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  }
}

seed();





