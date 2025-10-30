import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';

// Create database connection
const dbPath = path.join(process.cwd(), 'park-m-trees.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initDB() {
  try {
    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'brygadzista', 'pracownik')),
        email TEXT UNIQUE,
        password_hash TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects table
    db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_number TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        location TEXT,
        client TEXT,
        trees_to_plant INTEGER DEFAULT 0,
        trees_planted INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sites table
    db.exec(`
      CREATE TABLE IF NOT EXISTS sites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER REFERENCES projects(id),
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        address TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Species table
    db.exec(`
      CREATE TABLE IF NOT EXISTS species (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        scientific_name TEXT,
        active INTEGER DEFAULT 1
      )
    `);

    // Trees table
    db.exec(`
      CREATE TABLE IF NOT EXISTS trees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tree_number TEXT,
        species_id INTEGER REFERENCES species(id),
        site_id INTEGER NOT NULL REFERENCES sites(id),
        worker_id INTEGER REFERENCES users(id),
        plant_date DATE NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('posadzone', 'utrzymanie', 'wymiana', 'usuniete')),
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        accuracy REAL,
        notes TEXT,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tree Actions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS tree_actions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tree_id INTEGER NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
        action_type TEXT NOT NULL CHECK(action_type IN ('posadzenie', 'podlewanie', 'przyciecie', 'inspekcja', 'wymiana', 'usuniecie')),
        notes TEXT,
        performed_by INTEGER NOT NULL REFERENCES users(id),
        performed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Photos table
    db.exec(`
      CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL CHECK(entity_type IN ('tree', 'tree_action')),
        entity_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        url TEXT NOT NULL,
        thumbnail_url TEXT,
        taken_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        taken_by INTEGER NOT NULL REFERENCES users(id)
      )
    `);

    // Sync Queue table
    db.exec(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL,
        entity_data TEXT NOT NULL,
        action TEXT NOT NULL CHECK(action IN ('create', 'update', 'delete')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        synced INTEGER DEFAULT 0
      )
    `);

    // Insert default data
    insertDefaultData();
    
    console.log('SQLite database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

function insertDefaultData() {
  try {
    // Check if data already exists
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    
    if (userCount.count === 0) {
      // Hash default password for all users (password123)
      const defaultPassword = 'password123';
      const passwordHash = bcrypt.hashSync(defaultPassword, 10);

      // Insert default users with hashed passwords
      const insertUser = db.prepare('INSERT INTO users (name, role, email, password_hash) VALUES (?, ?, ?, ?)');
      insertUser.run('Admin Park M', 'admin', 'admin@park-m.pl', passwordHash);
      insertUser.run('Jan Kowalski', 'brygadzista', 'jan.kowalski@park-m.pl', passwordHash);
      insertUser.run('Anna Nowak', 'pracownik', 'anna.nowak@park-m.pl', passwordHash);
      insertUser.run('Piotr Wiśniewski', 'pracownik', 'piotr.wisniewski@park-m.pl', passwordHash);

      // Insert default sites
      const insertSite = db.prepare('INSERT INTO sites (code, name, address) VALUES (?, ?, ?)');
      insertSite.run('BUD-001', 'Park Centralny', 'ul. Parkowa 1, Warszawa');
      insertSite.run('BUD-002', 'Osiedle Zielone', 'ul. Kwiatowa 15, Kraków');
      insertSite.run('BUD-003', 'Skwer Miejski', 'ul. Główna 50, Wrocław');

      // Insert default species
      const insertSpecies = db.prepare('INSERT INTO species (name, scientific_name) VALUES (?, ?)');
      insertSpecies.run('Dąb szypułkowy', 'Quercus robur');
      insertSpecies.run('Klon zwyczajny', 'Acer platanoides');
      insertSpecies.run('Lipa drobnolistna', 'Tilia cordata');
      insertSpecies.run('Brzoza brodawkowata', 'Betula pendula');
      insertSpecies.run('Sosna zwyczajna', 'Pinus sylvestris');
      insertSpecies.run('Świerk pospolity', 'Picea abies');
      insertSpecies.run('Lipa srebrzysta Brabant', 'Tilia tomentosa Brabant');
      insertSpecies.run('Wiśnia piłkowana Kanzan', 'Prunus serrulata Kanzan');
      insertSpecies.run('Grusza drobnoowocowa Chanticleer', 'Pyrus calleryana Chanticleer');
      
      console.log('Default data inserted successfully');
      console.log('Default password for all users: password123');
    }
  } catch (error) {
    console.error('Error inserting default data:', error);
  }
}

// Helper function to execute queries
export function query<T = any>(sql: string, params: any[] = []): T[] {
  const stmt = db.prepare(sql);
  
  // Check if it's a SELECT query
  const trimmedSql = sql.trim().toUpperCase();
  if (trimmedSql.startsWith('SELECT') || trimmedSql.startsWith('PRAGMA')) {
    return stmt.all(...params) as T[];
  } else {
    // For INSERT, UPDATE, DELETE - run and return empty array
    stmt.run(...params);
    return [] as T[];
  }
}

export function queryOne<T = any>(sql: string, params: any[] = []): T | undefined {
  const stmt = db.prepare(sql);
  return stmt.get(...params) as T | undefined;
}

export function execute(sql: string, params: any[] = []): Database.RunResult {
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}

export { db };
