require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/admin');

async function createAdminOnce() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    const existing = await Admin.findOne({ username: 'admin' }).exec();
    if (existing) {
      console.log('Admin already exists, skipping creation.');
      await mongoose.disconnect();
      return;
    }
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: hashedPassword });
    console.log('Admin created');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Failed to create admin:', err);
    process.exit(1);
  }
}

createAdminOnce();