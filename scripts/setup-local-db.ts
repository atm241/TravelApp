import Database from 'better-sqlite3';

const sqlite = new Database('./local.db');

console.log('🏗️  Setting up local database...');

// Create users table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`);

// Create destinations table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    rating INTEGER NOT NULL,
    review_count INTEGER NOT NULL DEFAULT 0,
    price_from INTEGER NOT NULL,
    latitude TEXT,
    longitude TEXT
  );
`);

// Create activities table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    experience_count INTEGER NOT NULL DEFAULT 0
  );
`);

// Create trips table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    description TEXT,
    is_public INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create trip_items table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS trip_items (
    id INTEGER PRIMARY KEY,
    trip_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    day INTEGER NOT NULL,
    time TEXT,
    "order" INTEGER NOT NULL,
    type TEXT NOT NULL DEFAULT 'activity'
  );
`);

console.log('✅ Database tables created successfully!');
sqlite.close();
