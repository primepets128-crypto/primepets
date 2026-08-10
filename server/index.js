const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Prime Pets API is running' });
});

// Placeholder for Prisma integration
// const { PrismaClient } = require('@prisma/client');
// const { createClient } = require('@libsql/client');
// const { PrismaLibSQL } = require('@prisma/adapter-libsql');

// Placeholder routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/data', require('./routes/data'));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
