import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

// Detect environment: use SQLite locally, MariaDB on production
// Use SQLite if explicitly requested OR if no DB_HOST is set (local development)
const USE_SQLITE = process.env.USE_SQLITE !== 'false' && (
  process.env.NODE_ENV !== 'production' || 
  !process.env.DB_HOST ||
  process.env.USE_SQLITE === 'true'
);

if (USE_SQLITE) {
  console.log('🔧 Using SQLite for local development');
} else {
  console.log('🌐 Using MariaDB for production (Zenbox)');
}

// MariaDB connection configuration for Zenbox
const dbConfig = {
  host: process.env.DB_HOST || 's15.zenbox.pl',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'parkm_drzewa',
  password: process.env.DB_PASSWORD || 'GoZV5NcZP1',
  database: process.env.DB_NAME || 'parkm_trees',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Helper function to execute queries
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  if (USE_SQLITE) {
    // Use SQLite
    const { query: sqliteQuery } = await import('./db-sqlite');
    return Promise.resolve(sqliteQuery<T>(sql, params || []));
  } else {
    // Use MariaDB
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows as T[];
    } finally {
      connection.release();
    }
  }
}

// Helper function for single row queries
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  if (USE_SQLITE) {
    // Use SQLite
    const { queryOne: sqliteQueryOne } = await import('./db-sqlite');
    const result = sqliteQueryOne<T>(sql, params || []);
    return Promise.resolve(result || null);
  } else {
    // Use MariaDB
    const rows = await query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    await pool.getConnection();
    console.log('✓ Database connection successful');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
}

// Ensure database exists
async function ensureDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.end();
    console.log(`✓ Database ${dbConfig.database} is ready`);
  } catch (error) {
    console.error('Failed to ensure database exists:', error);
    throw error;
  }
}

// Initialize database schema
export async function initDB() {
  try {
    // Use SQLite for local development
    if (USE_SQLITE) {
      const { initDB: sqliteInitDB } = await import('./db-sqlite');
      sqliteInitDB();
      return;
    }
    
    // Use MariaDB for production
    // Ensure database exists first
    await ensureDatabase();
    
    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'brygadzista', 'pracownik') NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Projects (Projekty) table
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_number VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(500),
        client VARCHAR(255),
        trees_to_plant INT DEFAULT 0,
        trees_planted INT DEFAULT 0,
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Sites (Budowy) table
    await query(`
      CREATE TABLE IF NOT EXISTS sites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT,
        code VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500),
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Species (Gatunki) table
    await query(`
      CREATE TABLE IF NOT EXISTS species (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        scientific_name VARCHAR(255),
        active TINYINT(1) DEFAULT 1
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Trees table
    await query(`
      CREATE TABLE IF NOT EXISTS trees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tree_number VARCHAR(100),
        species_id INT,
        site_id INT NOT NULL,
        worker_id INT,
        plant_date DATE NOT NULL,
        status ENUM('posadzone', 'utrzymanie', 'wymiana', 'usuniete') NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        accuracy DECIMAL(10, 2),
        notes TEXT,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (species_id) REFERENCES species(id),
        FOREIGN KEY (site_id) REFERENCES sites(id),
        FOREIGN KEY (worker_id) REFERENCES users(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tree Actions table
    await query(`
      CREATE TABLE IF NOT EXISTS tree_actions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tree_id INT NOT NULL,
        action_type ENUM('posadzenie', 'podlewanie', 'przyciecie', 'inspekcja', 'wymiana', 'usuniecie') NOT NULL,
        notes TEXT,
        performed_by INT NOT NULL,
        performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tree_id) REFERENCES trees(id) ON DELETE CASCADE,
        FOREIGN KEY (performed_by) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Photos table
    await query(`
      CREATE TABLE IF NOT EXISTS photos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        entity_type ENUM('tree', 'tree_action') NOT NULL,
        entity_id INT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        thumbnail_url VARCHAR(500),
        taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        taken_by INT NOT NULL,
        FOREIGN KEY (taken_by) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Sync Queue for offline support
    await query(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INT AUTO_INCREMENT PRIMARY KEY,
        entity_type VARCHAR(100) NOT NULL,
        entity_data TEXT NOT NULL,
        action ENUM('create', 'update', 'delete') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        synced TINYINT(1) DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Insert default data
    await insertDefaultData();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Migrations are handled in the schema creation above

async function insertDefaultData() {
  try {
    // Check if data already exists
    const userCount = await query<{ count: number }>('SELECT COUNT(*) as count FROM users');
    
    if (userCount[0].count === 0) {
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
      
      console.log('Default data inserted successfully');
      console.log('Default password for all users: password123');
    }
  } catch (error) {
    console.error('Error inserting default data:', error);
  }
}
