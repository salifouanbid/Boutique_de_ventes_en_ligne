// build-catalogue.js
//
// Structure attendue :
//   images/
//     pochettes/   ← tes photos de pochettes
//     chargeur/    ← tes photos de chargeurs
//     incassable/  ← tes photos de coques incassables
//     (tu peux ajouter d'autres sous-dossiers, ils seront détectés automatiquement)
//
// À lancer chaque fois que tu ajoutes/retires une photo dans un de ces sous-dossiers.
//   node build-catalogue.js
// Ou en mode automatique (regénère tout seul dès qu'un fichier change) :
//   node build-catalogue.js --watch
//
// Convention de nom de fichier, à l'intérieur de chaque sous-dossier :
//   PRIX_Nom-Du-Produit_Point-fort-optionnel.jpg
// Exemple :
//   4500_Pochette-Wax-Indigo_Fait-main.jpg
//   6000_Pochette-Cuir-Suedine.jpg   (le point fort est facultatif)
//
// GESTION DU STOCK (nombre de pièces disponibles) :
//   Une vente confirmée sur WhatsApp → tu retires 1 du stock :
//     node build-catalogue.js --vendu "1500_Pochette-iphone-11.jpg"
//     node build-catalogue.js --vendu "chargeur/2000_Chargeur-rapide.jpg" 2   (si 2 vendues d'un coup)
//
//   Un réapprovisionnement → tu fixes le nouveau total :
//     node build-catalogue.js --stock "1500_Pochette-iphone-11.jpg" 10
//
//   Si un même nom de fichier existe dans deux catégories différentes, précise
//   la catégorie devant : "chargeur/2000_....jpg" plutôt que juste le nom.
//
// Le stock est gardé dans stock.json, séparé de images.json, pour ne jamais être
// écrasé quand tu ajoutes simplement une nouvelle photo.

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_FILE = path.join(__dirname, 'images.json');
const STOCK_FILE = path.join(__dirname, 'stock.json');
const VALID_EXT = /\.(jpe?g|png|webp)$/i;
const DEFAULT_STOCK = 5; // stock de départ attribué à toute nouvelle photo détectée

function parseFilename(filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const parts = base.split('_');

  const price = Number((parts[0] || '').replace(/[^\d]/g, '')) || 0;
  const name = (parts[1] || base).replace(/-/g, ' ').trim();
  const badge = parts[2] ? parts[2].replace(/-/g, ' ').trim() : '';

  return { name, price, badge };
}

function loadStock() {
  if (!fs.existsSync(STOCK_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(STOCK_FILE, 'utf8'));
  } catch {
    console.warn('⚠️  stock.json illisible, on repart d\'un stock vide.');
    return {};
  }
}

function saveStock(stock) {
  fs.writeFileSync(STOCK_FILE, JSON.stringify(stock, null, 2));
}

function listCategories() {
  return fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

function flattenPreviousImages(previous) {
  // Ancien format = tableau plat, nouveau format = objet { categorie: [...] }
  if (Array.isArray(previous)) return previous.map(p => p.image);
  return Object.values(previous || {}).flat().map(p => p.image);
}

function build() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Dossier introuvable : ${IMAGES_DIR}`);
    console.error(`   Crée un dossier "images" à côté de ce script, avec un sous-dossier par catégorie.`);
    return;
  }

  const categories = listCategories();
  if (categories.length === 0) {
    console.error(`❌ Aucun sous-dossier trouvé dans "${IMAGES_DIR}".`);
    console.error(`   Crée par exemple images/pochettes, images/chargeur, images/incassable et mets tes photos dedans.`);
    return;
  }

  // Fichiers posés directement dans images/ (hors sous-dossier) → on prévient, on les ignore.
  const strayFiles = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(entry => entry.isFile() && VALID_EXT.test(entry.name));
  if (strayFiles.length > 0) {
    strayFiles.forEach(f => console.warn(`⚠️  "${f.name}" est directement dans images/ — déplace-le dans un sous-dossier (ex. images/pochettes/).`));
  }

  const previous = fs.existsSync(OUTPUT_FILE)
    ? JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'))
    : {};
  const previousImagePaths = flattenPreviousImages(previous);

  const stock = loadStock();
  let stockChanged = false;

  const catalogue = {};
  const allNewOnes = [];
  const allCurrentPaths = [];

  categories.forEach(category => {
    const categoryDir = path.join(IMAGES_DIR, category);
    const files = fs.readdirSync(categoryDir).filter(f => VALID_EXT.test(f));

    catalogue[category] = files.map(file => {
      const stockKey = `${category}/${file}`;
      if (!(stockKey in stock)) {
        stock[stockKey] = DEFAULT_STOCK;
        stockChanged = true;
        allNewOnes.push(stockKey);
      }

      const { name, price, badge } = parseFilename(file);
      if (!price) {
        console.warn(`⚠️  "${stockKey}" n'a pas de prix détecté dans le nom — renomme-le en "PRIX_${file}"`);
      }

      const imagePath = `images/${category}/${file}`;
      allCurrentPaths.push(imagePath);
      return { name: name || file, price, badge, category, image: imagePath, stock: stock[stockKey] };
    });
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalogue, null, 2));
  if (stockChanged) saveStock(stock);

  const removedOnes = previousImagePaths.filter(img => !allCurrentPaths.includes(img));

  const timestamp = new Date().toLocaleTimeString('fr-FR');
  if (allNewOnes.length) {
    console.log(`[${timestamp}] ✅ ${allNewOnes.length} nouvelle(s) photo(s) détectée(s) (stock de départ : ${DEFAULT_STOCK}) :`);
    allNewOnes.forEach(f => console.log('   +', f));
  }
  if (removedOnes.length) {
    console.log(`[${timestamp}] 🗑️  ${removedOnes.length} photo(s) retirée(s) :`);
    removedOnes.forEach(f => console.log('   -', f));
  }
  if (!allNewOnes.length && !removedOnes.length) {
    const total = Object.values(catalogue).flat().length;
    console.log(`[${timestamp}] Rien de nouveau. Catalogue mis à jour quand même (${total} article(s)).`);
  } else {
    categories.forEach(cat => {
      console.log(`   • ${cat} : ${catalogue[cat].length} article(s)`);
    });
  }
}

function resolveStockKey(input, stock) {
  const cleaned = input.replace(/^images\//, '');
  if (stock[cleaned] !== undefined) return cleaned;

  const base = path.basename(cleaned);
  const matches = Object.keys(stock).filter(k => path.basename(k) === base);

  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    console.error(`❌ Plusieurs articles s'appellent "${base}" dans ${matches.map(m => m.split('/')[0]).join(', ')}.`);
    console.error(`   Précise la catégorie, ex. : "${matches[0]}"`);
    return null;
  }
  return null;
}

function handleVente() {
  const args = process.argv.slice(process.argv.indexOf('--vendu') + 1);
  const rawFile = args[0] || '';
  const quantite = Number(args[1]) || 1;

  if (!rawFile) {
    console.error('❌ Utilisation : node build-catalogue.js --vendu "nom-du-fichier.jpg" [quantité]');
    return;
  }

  const stock = loadStock();
  const key = resolveStockKey(rawFile, stock);
  if (!key) {
    console.error(`❌ "${rawFile}" n'est pas connu. Lance d'abord "node build-catalogue.js" pour l'enregistrer.`);
    return;
  }

  stock[key] = Math.max(0, stock[key] - quantite);
  saveStock(stock);
  console.log(`✅ Vente enregistrée : "${key}" → il reste ${stock[key]} en stock.`);
  build();
}

function handleRestock() {
  const args = process.argv.slice(process.argv.indexOf('--stock') + 1);
  const rawFile = args[0] || '';
  const nouveauStock = Number(args[1]);

  if (!rawFile || Number.isNaN(nouveauStock)) {
    console.error('❌ Utilisation : node build-catalogue.js --stock "nom-du-fichier.jpg" 10');
    return;
  }

  const stock = loadStock();
  const key = resolveStockKey(rawFile, stock) || rawFile.replace(/^images\//, '');
  stock[key] = Math.max(0, nouveauStock);
  saveStock(stock);
  console.log(`✅ Stock mis à jour : "${key}" → ${stock[key]} disponible(s).`);
  build();
}

// ====== Point d'entrée ======
if (process.argv.includes('--vendu')) {
  handleVente();
} else if (process.argv.includes('--stock')) {
  handleRestock();
} else {
  build();

  if (process.argv.includes('--watch')) {
    console.log(`\n👀 Mode automatique activé — dépose une photo dans un sous-dossier de "${IMAGES_DIR}" et le catalogue se met à jour tout seul.`);
    console.log('   (laisse cette fenêtre de terminal ouverte pendant que tu travailles)\n');

    let timer = null;
    fs.watch(IMAGES_DIR, { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(build, 300);
    });
  }
}
