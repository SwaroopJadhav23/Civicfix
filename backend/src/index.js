const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const connectDatabase = require('./config/db');

const authRoutes = require('./routes/auth');
const issueRoutes = require('./routes/issues');
const commentRoutes = require('./routes/comments');
const attachmentRoutes = require('./routes/attachments');
const attachmentSigned = require('./routes/attachmentSigned');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || '*'
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static uploads
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadDir));
// security middlewares
app.use(helmet());
app.use(mongoSanitize());

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/issues', commentRoutes);
app.use('/api/issues', attachmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attachments', attachmentSigned);

// security middlewares
app.use(helmet());
app.use(mongoSanitize());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Civicfix API',
      version: '1.0.0',
      description: 'API documentation for Civicfix'
    }
  },
  apis: ['./src/routes/*.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// healthcheck
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


