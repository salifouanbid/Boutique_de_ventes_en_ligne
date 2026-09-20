// build-catalogue.js
//
// À lancer chaque fois que tu ajoutes/retires une photo dans le dossier images/.
//   node build-catalogue.js
// Ou en mode automatique (regénère tout seul dès qu'un fichier change) :
//   node build-catalogue.js --watch
//
// Convention de nom de fichier dans images/ :
//   PRIX_Nom-Du-Produit_Point-fort-optionnel.jpg
// Exemple :
//   4500_Pochette-Wax-Indigo_Fait-main.jpg
//   6000_Pochette-Cuir-Suedine.jpg   (le point fort est facultatif)

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_FILE = path.join(__dirname, 'images.json');
const VALID_EXT = /\.(jpe?g|png|webp)$/i;

function parseFilename(filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const parts = base.split('_');

  const price = Number((parts[0] || '').replace(/[^\d]/g, '')) || 0;
  const name = (parts[1] || base).replace(/-/g, ' ').trim();
  const badge = parts[2] ? parts[2].replace(/-/g, ' ').trim() : '';

  return { name, price, badge };
}

function build() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Dossier introuvable : ${IMAGES_DIR}`);
    console.error(`   Crée un dossier "images" à côté de ce script et mets tes photos dedans.`);
    return;
  }

  const files = fs.readdirSync(IMAGES_DIR).filter(f => VALID_EXT.test(f));

  const previousImages = fs.existsSync(OUTPUT_FILE)
    ? JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8')).map(p => p.image)
    : [];

  const products = files.map(file => {
    const { name, price, badge } = parseFilename(file);
    if (!price) {
      console.warn(`⚠️  "${file}" n'a pas de prix détecté dans le nom — renomme-le en "PRIX_${file}"`);
    }
    return { name: name || file, price, badge, image: `images/${file}` };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2));

  const newOnes = files.filter(f => !previousImages.includes(`images/${f}`));
  const removedOnes = previousImages.filter(img => !files.includes(path.basename(img)));

  const timestamp = new Date().toLocaleTimeString('fr-FR');
  if (newOnes.length) {
    console.log(`[${timestamp}] ✅ ${newOnes.length} nouvelle(s) photo(s) détectée(s) :`);
    newOnes.forEach(f => console.log('   +', f));
  }
  if (removedOnes.length) {
    console.log(`[${timestamp}] 🗑️  ${removedOnes.length} photo(s) retirée(s) :`);
    removedOnes.forEach(f => console.log('   -', f));
  }
  if (!newOnes.length && !removedOnes.length) {
    console.log(`[${timestamp}] Rien de nouveau. Catalogue mis à jour quand même (${products.length} article(s)).`);
  } else {
    console.log(`[${timestamp}] Catalogue régénéré : ${products.length} article(s) au total dans images.json`);
  }
}

build();

if (process.argv.includes('--watch')) {
  console.log(`\n👀 Mode automatique activé — dépose une photo dans "${IMAGES_DIR}" et le catalogue se met à jour tout seul.`);
  console.log('   (laisse cette fenêtre de terminal ouverte pendant que tu travailles)\n');

  let timer = null;
  fs.watch(IMAGES_DIR, () => {
    // petite pause pour laisser le temps au fichier de finir d'être copié
    clearTimeout(timer);
    timer = setTimeout(build, 300);
  });
}
