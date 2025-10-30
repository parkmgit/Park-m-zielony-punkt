const Database = require('better-sqlite3');
const db = new Database('./park-m.db');

try {
  const insertSpecies = db.prepare('INSERT INTO species (name, scientific_name) VALUES (?, ?)');
  
  insertSpecies.run('Lipa srebrzysta Brabant', 'Tilia tomentosa Brabant');
  insertSpecies.run('Wiśnia piłkowana Kanzan', 'Prunus serrulata Kanzan');
  insertSpecies.run('Grusza drobnoowocowa Chanticleer', 'Pyrus calleryana Chanticleer');
  
  console.log('✅ Dodano 3 nowe gatunki:');
  console.log('  - Lipa srebrzysta Brabant');
  console.log('  - Wiśnia piłkowana Kanzan');
  console.log('  - Grusza drobnoowocowa Chanticleer');
  
  // Pokaż wszystkie gatunki
  const species = db.prepare('SELECT * FROM species ORDER BY name').all();
  console.log(`\n📋 Wszystkie gatunki (${species.length}):`);
  species.forEach(s => console.log(`  ${s.id}. ${s.name} (${s.scientific_name})`));
  
} catch (error) {
  console.error('❌ Błąd:', error.message);
} finally {
  db.close();
}
