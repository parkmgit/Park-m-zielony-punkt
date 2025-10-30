import { neon } from '@netlify/neon';
import bcrypt from 'bcrypt';

// Lazy initialization of Neon connection
let sql: any = null;

function getSql() {
  if (!sql) {
    console.log('🚀 Initializing Neon PostgreSQL database');
    sql = neon();
  }
  return sql;
}

// Helper function to execute queries
export async function query<T = any>(sqlQuery: string, params?: any[]): Promise<T[]> {
  try {
    // Convert ? placeholders to $1, $2, etc. for PostgreSQL
    let pgQuery = sqlQuery;
    let paramIndex = 1;
    while (pgQuery.includes('?')) {
      pgQuery = pgQuery.replace('?', `$${paramIndex++}`);
    }
    
    const rows = await getSql()(pgQuery, params || []);
    return rows as T[];
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Helper function for single row queries
export async function queryOne<T = any>(sqlQuery: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sqlQuery, params);
  return rows.length > 0 ? rows[0] : null;
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    await getSql()`SELECT 1`;
    console.log('✓ Database connection successful');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
}

// Initialize database schema
export async function initDB() {
  try {
    console.log('Initializing PostgreSQL database schema...');
    
    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'brygadzista', 'pracownik')),
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects (Projekty) table
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        project_number VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(500),
        client VARCHAR(255),
        trees_to_plant INTEGER DEFAULT 0,
        trees_planted INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sites (Budowy) table
    await query(`
      CREATE TABLE IF NOT EXISTS sites (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id),
        code VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Species (Gatunki) table
    await query(`
      CREATE TABLE IF NOT EXISTS species (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        scientific_name VARCHAR(255),
        active BOOLEAN DEFAULT true
      )
    `);

    // Trees table
    await query(`
      CREATE TABLE IF NOT EXISTS trees (
        id SERIAL PRIMARY KEY,
        tree_number VARCHAR(100),
        species_id INTEGER REFERENCES species(id),
        site_id INTEGER NOT NULL REFERENCES sites(id),
        worker_id INTEGER REFERENCES users(id),
        plant_date DATE NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('posadzone', 'utrzymanie', 'wymiana', 'usuniete')),
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        accuracy DECIMAL(10, 2),
        notes TEXT,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tree Actions table
    await query(`
      CREATE TABLE IF NOT EXISTS tree_actions (
        id SERIAL PRIMARY KEY,
        tree_id INTEGER NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
        action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('posadzenie', 'podlewanie', 'przyciecie', 'inspekcja', 'wymiana', 'usuniecie')),
        notes TEXT,
        performed_by INTEGER NOT NULL REFERENCES users(id),
        performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Photos table
    await query(`
      CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('tree', 'tree_action')),
        entity_id INTEGER NOT NULL,
        filename VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        thumbnail_url VARCHAR(500),
        taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        taken_by INTEGER NOT NULL REFERENCES users(id)
      )
    `);

    // Sync Queue for offline support
    await query(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id SERIAL PRIMARY KEY,
        entity_type VARCHAR(100) NOT NULL,
        entity_data TEXT NOT NULL,
        action VARCHAR(50) NOT NULL CHECK (action IN ('create', 'update', 'delete')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        synced BOOLEAN DEFAULT false
      )
    `);

    // Insert default data
    await insertDefaultData();
    
    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Migrations are handled in the schema creation above

async function insertDefaultData() {
  try {
    // Check if data already exists
    const userCount = await query<{ count: string | number }>('SELECT COUNT(*) as count FROM users');
    
    if (Number(userCount[0].count) === 0) {
      // Hash default password for all users (password123)
      const defaultPassword = 'password123';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      // Insert default users with hashed passwords
      await query('INSERT INTO users (name, role, email, password_hash) VALUES (?, ?, ?, ?)', ['Admin Park M', 'admin', 'admin@park-m.pl', passwordHash]);
      await query('INSERT INTO users (name, role, email, password_hash) VALUES (?, ?, ?, ?)', ['Jan Kowalski', 'brygadzista', 'jan.kowalski@park-m.pl', passwordHash]);
      await query('INSERT INTO users (name, role, email, password_hash) VALUES (?, ?, ?, ?)', ['Anna Nowak', 'pracownik', 'anna.nowak@park-m.pl', passwordHash]);
      await query('INSERT INTO users (name, role, email, password_hash) VALUES (?, ?, ?, ?)', ['Piotr Wiśniewski', 'pracownik', 'piotr.wisniewski@park-m.pl', passwordHash]);

      // Insert default sites
      await query('INSERT INTO sites (code, name, address) VALUES (?, ?, ?)', ['BUD-001', 'Park Centralny', 'ul. Parkowa 1, Warszawa']);
      await query('INSERT INTO sites (code, name, address) VALUES (?, ?, ?)', ['BUD-002', 'Osiedle Zielone', 'ul. Kwiatowa 15, Kraków']);
      await query('INSERT INTO sites (code, name, address) VALUES (?, ?, ?)', ['BUD-003', 'Skwer Miejski', 'ul. Główna 50, Wrocław']);

      // Insert default species
      await query('INSERT INTO species (name, scientific_name) VALUES (?, ?)', ['Dąb szypułkowy', 'Quercus robur']);
      await query('INSERT INTO species (name, scientific_name) VALUES (?, ?)', ['Klon zwyczajny', 'Acer platanoides']);
      await query('INSERT INTO species (name, scientific_name) VALUES (?, ?)', ['Lipa drobnolistna', 'Tilia cordata']);
      await query('INSERT INTO species (name, scientific_name) VALUES (?, ?)', ['Brzoza brodawkowata', 'Betula pendula']);
      await query('INSERT INTO species (name, scientific_name) VALUES (?, ?)', ['Sosna zwyczajna', 'Pinus sylvestris']);
      await query('INSERT INTO species (name, scientific_name) VALUES (?, ?)', ['Świerk pospolity', 'Picea abies']);
      await query('INSERT INTO species (name, scientific_name) VALUES (?, ?)', ['Lipa srebrzysta Brabant', 'Tilia tomentosa Brabant']);
      await query('INSERT INTO species (name, scientific_name) VALUES (?, ?)', ['Wiśnia piłkowana Kanzan', 'Prunus serrulata Kanzan']);
      await query('INSERT INTO species (name, scientific_name) VALUES (?, ?)', ['Grusza drobnoowocowa Chanticleer', 'Pyrus calleryana Chanticleer']);
      
      console.log('Default data inserted successfully');
      console.log('Default password for all users: password123');
    }
  } catch (error) {
    console.error('Error inserting default data:', error);
  }
}
