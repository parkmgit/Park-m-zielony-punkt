const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'park-m-trees.db');
const db = new Database(dbPath);

try {
  const treesCount = db.prepare('SELECT COUNT(*) as count FROM trees').get();
  console.log('Liczba drzew w lokalnej bazie:', treesCount.count);
  
  if (treesCount.count > 0) {
    const trees = db.prepare('SELECT id, species_name, site_code, plant_date FROM trees LIMIT 5').all();
    console.log('\nPierwsze 5 drzew:');
    trees.forEach(tree => {
      console.log(`- ID: ${tree.id}, Gatunek: ${tree.species_name || 'brak'}, Budowa: ${tree.site_code}, Data: ${tree.plant_date}`);
    });
  }
} catch (error) {
  console.error('Błąd:', error.message);
}

db.close();
