const express = require('express');
const Issue = require('../models/Issue');
const Attachment = require('../models/Attachment');
const auth = require('../middleware/auth');

const router = express.Router();

const { createIssueSchema, updateIssueSchema } = require('../validators/issue');

// Create issue
router.post('/', auth, async (req, res, next) => {
  const { error, value } = createIssueSchema.validate(req.body, { stripUnknown: true });
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const { title, description, category, priority, location } = value;
    const issue = new Issue({
      title,
      description,
      category,
      priority,
      reporterId: req.user._id,
      location: location || undefined
    });
    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    next(err);
  }
});

// List issues with simple pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const issues = await Issue.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('attachments');
    res.json({ issues, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single issue
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('attachments');
    if (!issue) return res.status(404).json({ message: 'Not found' });
    res.json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update issue
router.put('/:id', auth, async (req, res, next) => {
  const { error, value } = updateIssueSchema.validate(req.body, { stripUnknown: true });
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Not found' });
    // authorization: only reporter or admin can update
    if (String(issue.reporterId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updatable = ['title', 'description', 'category', 'priority', 'status', 'location'];
    updatable.forEach((field) => {
      if (field in value) issue[field] = value[field];
    });
    await issue.save();
    res.json(issue);
  } catch (err) {
    next(err);
  }
});

// Delete issue
router.delete('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Not found' });
    if (String(issue.reporterId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await Attachment.deleteMany({ issueId: issue._id });
    await issue.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


