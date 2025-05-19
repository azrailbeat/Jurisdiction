#!/usr/bin/env node

// This script will push the database schema to the database

const { execSync } = require('child_process');

try {
  console.log('🚀 Pushing database schema to PostgreSQL...');
  execSync('npx drizzle-kit push:pg', { stdio: 'inherit' });
  console.log('✅ Database schema pushed successfully!');
} catch (error) {
  console.error('❌ Error pushing database schema:', error);
  process.exit(1);
}