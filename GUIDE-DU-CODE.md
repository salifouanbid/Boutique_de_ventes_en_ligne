# Guide du code — Site Pochettes Chic

Ce document explique chaque fichier du projet, section par section et ligne par ligne
pour les parties en JavaScript (c'est là que se passe toute la logique).

---

## 1. Structure du projet

```
index.html            → le contenu et la structure de la page
style.css              → l'apparence (couleurs, tailles, mise en page)
script.js              → tout ce qui est dynamique (catalogue, formulaire, WhatsApp)
build-catalogue.js     → script à lancer toi-même pour mettre à jour le catalogue
images.json            → généré automatiquement par build-catalogue.js, ne pas éditer à la main
stock.json              → nombre de pièces disponibles par photo, mis à jour via --vendu / --stock
images/                → dossier où tu déposes tes photos de produits
images/LISEZ-MOI.txt   → rappel de la convention de nom de fichier
```

---

## 2. index.html — le contenu de la page

### En-tête du document (lignes 1-11)
```html
<!DOCTYPE html>
<html lang="fr">
```
Déclare que c'est du HTML5 et que la langue de la page est le français (aide les
lecteurs d'écran et les moteurs de recherche).

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
- `charset="UTF-8"` : permet d'afficher les accents et emojis correctement.
- `viewport` : force la page à s'adapter à la largeur de l'écran du téléphone
  (sans ça, un mobile afficherait la page comme sur un écran d'ordinateur, en tout petit).

```html
<title>Pochettes Chic — Vitrine &amp; Commande WhatsApp</title>
```
Le titre affiché dans l'onglet du navigateur.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces...&family=Public+Sans..." rel="stylesheet">
```
Charge deux polices Google Fonts : `Fraunces` (la police avec du caractère, utilisée
pour les titres) et `Public Sans` (police simple, utilisée pour le texte courant).
Le `preconnect` accélère un peu le chargement.

```html
<link rel="stylesheet" href="style.css">
```
Charge le fichier de style. Doit rester dans le même dossier que `index.html`.

### Le header (lignes 15-20)
```html
<header>
  <div class="nav">
    <div class="brand">Pochettes Chic</div>
    <a class="nav-cta" id="navOrder" href="#" ...>Commander sur WhatsApp</a>
  </div>
</header>
```
Barre du haut, toujours visible même en scrollant (grâce à `position: sticky` dans le CSS).
Le lien `id="navOrder"` a `href="#"` par défaut — c'est `script.js` qui remplace ce `#`
par le vrai lien WhatsApp au chargement de la page (voir `wireGeneralLinks()`).

### La bannière promo (ligne 22)
```html
<div class="promo">🎉 Offre de lancement ce mois-ci : ...</div>
```
Simple bandeau de texte. Pour changer l'offre ou la retirer, modifie/supprime cette ligne.

### La section Hero (lignes 24-43)
```html
<section class="hero">
  <div class="wrap hero-inner">
    <div>
      <h1>Des pochettes qui font tourner les têtes...</h1>
      <p class="sub">Découvrez le catalogue...</p>
      <div class="cta-row">
        <a class="btn btn-primary order-link" href="#" ...>Voir le catalogue</a>
        <a class="btn btn-secondary" href="#contact">Où me trouver</a>
      </div>
    </div>
    <div class="swatch-grid" aria-hidden="true">
      <div class="swatch s1"></div>
      ... (6 blocs colorés)
    </div>
  </div>
</section>
```
- Le grand titre `<h1>` et le texte d'accroche.
- `class="order-link"` : même mécanisme que `navOrder`, script.js remplace le `#` par le lien WhatsApp.
- `href="#contact"` : lien d'ancre classique, fait défiler la page jusqu'à la section `id="contact"`.
- Les 6 `<div class="swatch">` sont des carrés de couleur (dégradés CSS) qui servent de
  décoration tant que tu n'as pas encore de vraies photos. `aria-hidden="true"` les cache
  aux lecteurs d'écran car ils sont purement décoratifs.

### La section Catalogue (lignes 45-53)
```html
<section id="catalogue">
  <div class="wrap">
    <div class="section-head">
      <h2>Le catalogue</h2>
      <p>...</p>
    </div>
    <div class="grid" id="catalogueGrid"></div>
  </div>
</section>
```
`id="catalogueGrid"` est une **coquille vide** dans le HTML. C'est `script.js` qui
remplit ce `<div>` avec les cartes produits (fonction `renderCatalogue`), que ce soit
depuis `PRODUCTS`, `images.json` ou le Google Sheet.

### La section "Pourquoi commander ici" (lignes 55-66)
Trois chiffres de réassurance (`100%`, `24h`, `0F`) codés en dur dans le HTML —
modifie directement le texte ici si besoin, ce n'est pas généré par JS.

### La section Avis clients (lignes 68-79)
```html
<div class="grid" id="temoignagesGrid"></div>
```
Même principe que `catalogueGrid` : coquille vide, remplie par `buildTestimonials()`
dans script.js à partir du tableau `TESTIMONIALS`.

### La section formulaire d'avis (lignes 81-115)
```html
<form id="reviewForm" class="review-form">
  <div class="field">
    <label for="reviewName">Votre nom</label>
    <input type="text" id="reviewName" name="reviewName" required>
  </div>

  <div class="field">
    <span class="field-label">Note du site</span>
    <div class="stars" data-target="siteNote"></div>
  </div>
  ... (2 autres blocs .stars pour "vendeur" et "marchandise")

  <div class="field">
    <label for="reviewComment">Un commentaire (facultatif)</label>
    <textarea id="reviewComment" name="reviewComment" rows="3"></textarea>
  </div>

  <button type="submit" class="btn btn-primary">Envoyer mon avis sur WhatsApp</button>
  <p class="form-note" id="formNote"></p>
</form>
```
- Chaque `<div class="stars" data-target="...">` est vide au départ : `script.js`
  (fonction `buildStarWidgets`) y insère 5 boutons ★ cliquables.
- `data-target` sert juste d'étiquette pour distinguer les 3 blocs d'étoiles entre eux.
- `id="formNote"` : petit message qui s'affiche après l'envoi ("Merci !" ou erreur).
- Le formulaire n'envoie rien à un serveur — `script.js` intercepte le clic sur
  "Envoyer" et ouvre WhatsApp à la place (voir `wireReviewForm`).

### La section Contact et le footer (lignes 117-145)
Contenu statique (adresse, horaires). Le lien `id="footWhatsapp"` suit le même
principe que `navOrder`.

### Les scripts en bas de page (lignes 149-150)
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script src="script.js"></script>
```
- **PapaParse** : bibliothèque externe qui sait lire un fichier CSV (utilisée pour
  le Google Sheet, uniquement si tu actives `SHEET_CSV_URL`).
- **script.js** : ton code. Placé en dernier pour que le HTML soit déjà chargé
  quand le script s'exécute (sinon `document.getElementById(...)` ne trouverait rien).

---

## 3. style.css — l'apparence

Le fichier est organisé en blocs commentés. Les points clés :

### Les variables de couleur (`:root { ... }`)
```css
:root{
  --cream:#FBF6EC;
  --ink:#1B2A4A;
  --mustard:#E8A93C;
  --brick:#B84A2F;
  --leaf:#4E7A5B;
  ...
}
```
Toutes les couleurs du site sont définies une seule fois ici sous forme de "variables"
(`--cream`, `--ink`, etc.), puis réutilisées partout avec `var(--ink)` par exemple.
**Pour changer la palette de couleur du site entier, il suffit de modifier ces
quelques lignes** plutôt que de chercher chaque couleur dans tout le fichier.

### Le mode sombre
```css
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){ ... }
}
:root[data-theme="dark"]{ ... }
```
Redéfinit les mêmes variables avec des teintes adaptées si le téléphone/ordinateur
du visiteur est en mode sombre. Tu n'as rien à faire, ça s'adapte tout seul.

### Les classes principales
- `.wrap` : centre le contenu et limite sa largeur maximale (1080px) sur grand écran.
- `.btn`, `.btn-primary`, `.btn-secondary` : styles des boutons.
- `.grid` : la grille responsive qui contient les cartes produits/témoignages
  (`repeat(auto-fill, minmax(220px,1fr))` = autant de colonnes de 220px minimum
  que la largeur le permet, et ça s'adapte automatiquement sur mobile).
- `.card` : le cadre blanc (ou sombre en mode nuit) de chaque carte produit/témoignage.
- `.stars button` : le style des étoiles cliquables du formulaire d'avis
  (grises par défaut, jaunes/`--mustard` une fois sélectionnées via la classe `.active`
  ajoutée par script.js).
- `@media(min-width:760px)` tout en bas : règles qui ne s'appliquent qu'à partir
  de 760px de large (tablette/ordinateur), pour passer de 1 colonne à 2 colonnes
  dans le hero et le footer.
- `.stock` : texte discret "X en stock" sous le prix ; `.stock-low` et `.stock-out`
  passent le texte en rouge/brique pour attirer l'œil quand il en reste peu ou plus du tout.
- `.order-btn-disabled` : remplace visuellement le bouton "Commander" par un bloc grisé
  "Rupture de stock" (non cliquable, `cursor:not-allowed`) quand le stock est à 0.

---

## 4. script.js — toute la logique

### Bloc de configuration (lignes 1-24)
```js
const WHATSAPP_NUMBER = "22900000000";
const DEFAULT_MESSAGE = "Bonjour, je viens du site Pochettes Chic...";
const SHEET_CSV_URL = "";
const LOCAL_CATALOGUE_URL = "images.json";
const PRODUCTS = [ ... ];
const TESTIMONIALS = [ ... ];
```
Toutes les valeurs que tu es censé modifier toi-même sont regroupées ici, en haut
du fichier :
- `WHATSAPP_NUMBER` : le numéro du vendeur, sans le `+`.
- `SHEET_CSV_URL` : lien vers un Google Sheet publié en CSV (laisse vide si inutilisé).
- `LOCAL_CATALOGUE_URL` : le fichier généré par `build-catalogue.js` — normalement
  tu ne touches pas à cette ligne.
- `PRODUCTS` : catalogue de secours, affiché si `images.json` est vide ou inaccessible.
- `TESTIMONIALS` : les avis clients que tu choisis d'afficher publiquement.

### `waLink(message)` (lignes 27-29)
```js
function waLink(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
```
Construit un lien WhatsApp cliquable. `encodeURIComponent` transforme les espaces,
accents et caractères spéciaux du message pour qu'ils passent correctement dans une URL.
Toutes les autres fonctions du fichier utilisent `waLink(...)` pour générer leurs liens.

### `buildDescriptionFromRow(row)` (lignes 33-41)
```js
function buildDescriptionFromRow(row){
  const couleur = (row['Couleur'] || '').trim();
  const matiere = (row['Matière'] || '').trim();
  const occasion = (row['Occasion'] || '').trim();
  let name = 'Pochette';
  if (couleur) name += ' ' + couleur;
  if (matiere) name += ' en ' + matiere;
  return { name, occasion };
}
```
Utilisée uniquement pour le Google Sheet : transforme les choix de menus déroulants
du vendeur (colonnes `Couleur`, `Matière`, `Occasion`) en une phrase du type
"Pochette rouge en cuir", sans qu'il ait besoin d'écrire quoi que ce soit lui-même.

### `parsePrice(value)` (lignes 43-46)
```js
function parsePrice(value){
  const digits = String(value || '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}
```
Nettoie une valeur de prix (par exemple "4 500 FCFA" ou "4500") en ne gardant que
les chiffres, puis la convertit en nombre. `[^\d]` veut dire "tout ce qui n'est pas
un chiffre" — ces caractères sont supprimés.

### `stockMessage(stock)` (nouvelle fonction, juste avant `renderCard`)
```js
function stockMessage(stock){
  if (stock === undefined || stock === null) return '';
  if (stock <= 0) return `<p class="stock stock-out">Rupture de stock</p>`;
  if (stock <= 2) return `<p class="stock stock-low">Plus que ${stock} en stock !</p>`;
  return `<p class="stock">${stock} en stock</p>`;
}
```
Transforme le nombre `stock` d'un produit en petit texte à afficher sous le prix :
- Pas de valeur (`undefined`/`null`, ex. les produits du catalogue manuel `PRODUCTS`
  qui n'ont pas de champ `stock`) → rien n'est affiché.
- `0` ou moins → "Rupture de stock" en rouge.
- `1` ou `2` → "Plus que X en stock !" en rouge, pour créer un peu d'urgence.
- Sinon → "X en stock" en gris neutre.

### `renderCard(p)` (mise à jour)
```js
function renderCard(p){
  const media = p.image
    ? `<img class="card-img" src="${p.image}" ...>`
    : `<div class="card-img ${p.tag || 's1'}"></div>`;
  const priceLabel = p.price ? `${p.price.toLocaleString('fr-FR')} FCFA` : '';
  const outOfStock = p.stock !== undefined && p.stock <= 0;
  const orderMsg = '...';
  const orderBtn = outOfStock
    ? `<span class="order-btn order-btn-disabled">Rupture de stock</span>`
    : `<a class="order-btn" href="${waLink(orderMsg)}" ...>Commander</a>`;

  return `<div class="card"> ... ${stockMessage(p.stock)} ${orderBtn} </div>`;
}
```
Construit le HTML d'**une seule carte produit**, à partir d'un objet `p`
(`{ name, price, image ou tag, badge, occasion, stock }`).
- Si `p.image` existe (photo réelle) → affiche une balise `<img>`.
- Sinon → affiche un carré coloré de secours (`p.tag`, ex. `"s1"`).
- `onerror="..."` : si le lien de la photo est cassé, remplace automatiquement
  l'image par un carré coloré plutôt que de montrer une icône d'image cassée.
- `outOfStock` : vrai seulement si `p.stock` existe ET vaut 0 ou moins (les produits
  du catalogue manuel sans champ `stock` restent donc toujours commandables).
- `orderBtn` : soit le vrai bouton "Commander" avec son lien WhatsApp, soit un
  `<span>` grisé "Rupture de stock" (pas de lien, pas cliquable) si `outOfStock`.
- `stockMessage(p.stock)` insère la petite mention de stock juste au-dessus du bouton.

### `renderCatalogue(items)` (lignes 67-69)
```js
function renderCatalogue(items){
  document.getElementById('catalogueGrid').innerHTML = items.map(renderCard).join('');
}
```
Prend une liste de produits, appelle `renderCard` sur chacun, et insère le résultat
dans la grille `#catalogueGrid` du HTML.

### `buildCatalogue()` (lignes 71-97) — la logique la plus importante
```js
function buildCatalogue(){
  //renderCatalogue(PRODUCTS);          // 1. affichage immédiat du catalogue de secours

  if (LOCAL_CATALOGUE_URL) {          // 2. tentative de charger images.json
    fetch(LOCAL_CATALOGUE_URL)
      .then(res => { if (!res.ok) throw new Error(...); return res.json(); })
      .then(items => {
        if (Array.isArray(items) && items.length > 0) {
          renderCatalogue(items);      // succès → on remplace par tes vraies photos
        } else if (SHEET_CSV_URL) {
          loadFromSheet();             // sinon, on retente avec le Google Sheet
        }
      })
      .catch(() => {
        if (SHEET_CSV_URL) loadFromSheet();
      });
    return;
  }

  if (SHEET_CSV_URL) loadFromSheet();
}
```
Ordre de priorité du catalogue affiché :
1. `PRODUCTS` (immédiat, pour éviter un écran vide le temps du chargement)
2. `images.json` (tes photos, via `build-catalogue.js`) — si trouvé et non vide, remplace tout
3. Le Google Sheet (`SHEET_CSV_URL`) — seulement si `images.json` est vide/absent
   et qu'un lien de Sheet est renseigné
4. Si tout échoue, `PRODUCTS` reste affiché tel quel

`fetch(...)` est la fonction native du navigateur pour aller chercher un fichier
ou une donnée sur le réseau (ou en local). `.then()` s'exécute si ça réussit,
`.catch()` si ça échoue.

### `loadFromSheet()` (lignes 99-125)
```js
function loadFromSheet(){
  Papa.parse(SHEET_CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => { ... },
    error: () => { ... }
  });
}
```
Utilise la bibliothèque PapaParse pour télécharger et lire le CSV publié depuis
Google Sheets. `header: true` veut dire que la première ligne du CSV (les titres
de colonnes du formulaire) sert de clé pour accéder à chaque valeur, par exemple
`row['Prix']`. Une fois les lignes récupérées, elles sont transformées en objets
produits avec `buildDescriptionFromRow` et `parsePrice`, puis affichées.

### `wireGeneralLinks()` (lignes 127-131)
```js
function wireGeneralLinks(){
  document.querySelectorAll('.order-link, #navOrder, #footWhatsapp').forEach(el => {
    el.href = waLink(DEFAULT_MESSAGE);
  });
}
```
Trouve tous les liens WhatsApp "génériques" du site (ceux qui n'ont pas de produit
précis associé) et remplace leur `href="#"` par le vrai lien WhatsApp.

### `starsAsText(n)` (lignes 133-135)
```js
function starsAsText(n){
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}
```
Transforme un chiffre (ex: `4`) en texte d'étoiles (`★★★★☆`). Utilisé à la fois
pour afficher les témoignages et pour construire le message WhatsApp de l'avis.

### `buildTestimonials()` (lignes 137-151)
Même logique que `renderCatalogue`, mais pour la liste `TESTIMONIALS` : si le
tableau est vide, affiche un message d'attente ; sinon, construit une carte par témoignage.

### `buildStarWidgets()` (lignes 154-171)
```js
function buildStarWidgets(){
  document.querySelectorAll('.stars').forEach(container => {
    container.dataset.value = "0";
    container.innerHTML = [1,2,3,4,5].map(i =>
      `<button type="button" data-star="${i}" ...>★</button>`
    ).join('');

    container.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = Number(btn.dataset.star);
        container.dataset.value = String(val);
        container.querySelectorAll('button').forEach(b => {
          b.classList.toggle('active', Number(b.dataset.star) <= val);
        });
      });
    });
  });
}
```
Pour chaque bloc `.stars` du formulaire (il y en a 3 : site / vendeur / marchandise) :
1. Crée 5 boutons ★.
2. Quand on clique sur l'étoile n°`val`, retient cette valeur dans `container.dataset.value`
   et allume (classe `.active`) toutes les étoiles jusqu'à celle-là (effet visuel classique
   "3 étoiles sur 5 sélectionnées").

### `wireReviewForm()` (lignes 173-213)
```js
function wireReviewForm(){
  const form = document.getElementById('reviewForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();   // empêche le formulaire de recharger la page (comportement par défaut)

    const name = document.getElementById('reviewName').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    const siteNote = Number(form.querySelector('[data-target="siteNote"]').dataset.value || 0);
    ... (idem pour vendeurNote et marchandiseNote)

    if (!name || siteNote === 0 || vendeurNote === 0 || marchandiseNote === 0){
      // affiche un message d'erreur et arrête tout ici (return)
    }

    const message = [ ... ].filter(Boolean).join('\n');  // construit le texte du message

    window.open(waLink(message), '_blank', 'noopener');  // ouvre WhatsApp dans un nouvel onglet

    // réinitialise le formulaire pour un éventuel prochain avis
  });
}
```
Écoute l'événement "envoi du formulaire". Vérifie que le nom et les 3 notes sont
bien remplis, sinon affiche un message d'erreur sans rien envoyer. Si tout est bon,
construit un message texte récapitulatif et ouvre WhatsApp avec ce message pré-rempli.

### Les dernières lignes (215-221) — le point de départ
```js
document.getElementById('year').textContent = new Date().getFullYear();
buildCatalogue();
buildTestimonials();
buildStarWidgets();
wireReviewForm();
wireGeneralLinks();
```
Ce sont les seules lignes qui s'exécutent **immédiatement** au chargement de la page
(tout ce qui précède ne fait que définir des fonctions, sans les exécuter). Dans l'ordre :
1. Met à jour l'année dans le footer.
2. Construit le catalogue.
3. Construit les témoignages.
4. Crée les widgets d'étoiles du formulaire.
5. Active la logique du formulaire d'avis.
6. Met à jour tous les boutons WhatsApp génériques.

---

## 5. build-catalogue.js — le script que tu lances toi-même

Ce fichier ne s'exécute PAS dans le navigateur : c'est un script **Node.js**, à lancer
depuis un terminal avec `node build-catalogue.js`.

### Configuration (en haut du fichier)
```js
const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_FILE = path.join(__dirname, 'images.json');
const STOCK_FILE = path.join(__dirname, 'stock.json');
const VALID_EXT = /\.(jpe?g|png|webp)$/i;
const DEFAULT_STOCK = 5; // stock de départ attribué à toute nouvelle photo détectée
```
- `__dirname` = le dossier où se trouve le script lui-même.
- `STOCK_FILE` : fichier séparé qui garde le nombre de pièces disponibles par photo,
  indépendamment de `images.json` (qui lui est entièrement régénéré à chaque exécution).
- `VALID_EXT` : une expression régulière qui vérifie qu'un nom de fichier se termine
  bien par `.jpg`, `.jpeg`, `.png` ou `.webp` (le `i` à la fin = insensible à la casse,
  donc `.JPG` fonctionne aussi).
- `DEFAULT_STOCK` : le stock attribué automatiquement à toute photo qui n'a pas
  encore de ligne dans `stock.json` (typiquement une photo qu'on vient d'ajouter).

### `parseFilename(filename)` (lignes 18-26)
```js
function parseFilename(filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const parts = base.split('_');

  const price = Number((parts[0] || '').replace(/[^\d]/g, '')) || 0;
  const name = (parts[1] || base).replace(/-/g, ' ').trim();
  const badge = parts[2] ? parts[2].replace(/-/g, ' ').trim() : '';

  return { name, price, badge };
}
```
Découpe un nom de fichier comme `4500_Pochette-Wax-Indigo_Fait-main.jpg` :
1. Enlève l'extension (`.jpg`) → `4500_Pochette-Wax-Indigo_Fait-main`
2. Coupe aux `_` → `["4500", "Pochette-Wax-Indigo", "Fait-main"]`
3. `parts[0]` = le prix, nettoyé pour ne garder que les chiffres
4. `parts[1]` = le nom, avec les `-` remplacés par des espaces → "Pochette Wax Indigo"
5. `parts[2]` = le point fort (optionnel), même traitement → "Fait main"

### `loadStock()` et `saveStock(stock)`
```js
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
```
`loadStock()` lit `stock.json` et le transforme en objet JavaScript
(`{ "nom-fichier.jpg": 5, ... }`). S'il n'existe pas encore ou est corrompu, on repart
d'un objet vide plutôt que de planter. `saveStock(stock)` fait l'inverse : réécrit
l'objet dans le fichier.

### `build()` — la fonction principale (mise à jour)
```js
function build() {
  if (!fs.existsSync(IMAGES_DIR)) { ... }  // vérifie que le dossier images/ existe

  const files = fs.readdirSync(IMAGES_DIR).filter(f => VALID_EXT.test(f));
  // liste tous les fichiers du dossier, ne garde que les images valides

  const previousImages = fs.existsSync(OUTPUT_FILE)
    ? JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8')).map(p => p.image)
    : [];
  // relit l'ancien images.json (s'il existe) pour savoir ce qu'il y avait AVANT

  const stock = loadStock();
  let stockChanged = false;

  files.forEach(file => {
    if (!(file in stock)) {
      stock[file] = DEFAULT_STOCK;
      stockChanged = true;
    }
  });
  // toute photo qui n'a pas encore de ligne dans stock.json reçoit DEFAULT_STOCK

  const products = files.map(file => {
    const { name, price, badge } = parseFilename(file);
    if (!price) { console.warn(...); }
    return { name: name || file, price, badge, image: `images/${file}`, stock: stock[file] };
  });
  // chaque produit reçoit maintenant son champ "stock"

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2));
  if (stockChanged) saveStock(stock);
  // stock.json n'est réécrit que si de nouvelles photos ont été ajoutées

  const newOnes = files.filter(f => !previousImages.includes(`images/${f}`));
  const removedOnes = previousImages.filter(img => !files.includes(path.basename(img)));
  // compare l'ancienne liste et la nouvelle pour savoir ce qui a changé

  // ... affiche un résumé dans le terminal (nouvelles photos, photos retirées, ou rien)
}
```
Point important : `images.json` est entièrement régénéré à chaque exécution à partir
du dossier `images/`, mais **`stock.json` n'est jamais réinitialisé** — il ne fait
que gagner de nouvelles entrées quand une photo arrive. Le stock déjà en cours
(ex. après plusieurs ventes) n'est donc jamais perdu quand tu ajoutes juste une photo.

### Gestion des ventes et du réapprovisionnement — `--vendu` et `--stock`
```js
function findFileArg(name) {
  // gère aussi bien le nom seul que "images/nom"
  return path.basename(name);
}
```
Permet de taper indifféremment `"4500_Pochette.jpg"` ou `"images/4500_Pochette.jpg"`
en argument — `path.basename` ne garde que le nom du fichier, sans le dossier.

```js
function handleVente() {
  const args = process.argv.slice(process.argv.indexOf('--vendu') + 1);
  const file = findFileArg(args[0] || '');
  const quantite = Number(args[1]) || 1;

  if (!file) {
    console.error('❌ Utilisation : node build-catalogue.js --vendu "nom-du-fichier.jpg" [quantité]');
    return;
  }

  const stock = loadStock();
  if (!(file in stock)) {
    console.error(`❌ "${file}" n'est pas connu. Lance d'abord "node build-catalogue.js" pour l'enregistrer.`);
    return;
  }

  stock[file] = Math.max(0, stock[file] - quantite);
  saveStock(stock);
  console.log(`✅ Vente enregistrée : "${file}" → il reste ${stock[file]} en stock.`);
  build();
}
```
Appelée quand tu tapes `node build-catalogue.js --vendu "fichier.jpg"` :
1. Récupère le nom du fichier et la quantité vendue (`args[1]`, ou `1` par défaut
   si tu ne précises rien).
2. Vérifie que ce fichier est bien connu (sinon erreur claire plutôt qu'un plantage).
3. Retire `quantite` du stock actuel, sans jamais descendre en dessous de 0
   (`Math.max(0, ...)`).
4. Sauvegarde, puis relance `build()` pour que `images.json` reflète immédiatement
   le nouveau stock (pas besoin de relancer la commande normale après).

```js
function handleRestock() {
  const args = process.argv.slice(process.argv.indexOf('--stock') + 1);
  const file = findFileArg(args[0] || '');
  const nouveauStock = Number(args[1]);

  if (!file || Number.isNaN(nouveauStock)) {
    console.error('❌ Utilisation : node build-catalogue.js --stock "nom-du-fichier.jpg" 10');
    return;
  }

  const stock = loadStock();
  stock[file] = Math.max(0, nouveauStock);
  saveStock(stock);
  console.log(`✅ Stock mis à jour : "${file}" → ${stock[file]} disponible(s).`);
  build();
}
```
Même principe pour `--stock`, mais ici on ne retire pas une quantité : on **fixe**
directement le nouveau total (utile après un réapprovisionnement, ex. tu repars
avec 10 pièces neuves du même modèle).

### Point d'entrée du script (tout en bas, mis à jour)
```js
if (process.argv.includes('--vendu')) {
  handleVente();
} else if (process.argv.includes('--stock')) {
  handleRestock();
} else {
  build();

  if (process.argv.includes('--watch')) {
    ...
  }
}
```
`process.argv` contient les mots tapés après `node build-catalogue.js` dans le
terminal. Le script regarde d'abord si `--vendu` ou `--stock` en fait partie ;
si oui, il exécute uniquement cette action (puis regénère le catalogue via `build()`
à la fin de chacune). Sinon, il fait le comportement normal : `build()` tout seul,
avec en plus le mode `--watch` si demandé.

### Mode `--watch`
```js
if (process.argv.includes('--watch')) {
  console.log(...);

  let timer = null;
  fs.watch(IMAGES_DIR, () => {
    clearTimeout(timer);
    timer = setTimeout(build, 300);
  });
}
```
- `process.argv` contient les mots tapés après `node build-catalogue.js` dans le
  terminal ; si `--watch` en fait partie, on active ce bloc.
- `fs.watch` surveille le dossier `images/` et déclenche la fonction à chaque
  changement (ajout, suppression, renommage de fichier).
- Le `clearTimeout` / `setTimeout` évite de relancer `build()` plusieurs fois
  d'affilée si le système de fichiers envoie plusieurs signaux de suite pour
  une seule copie de fichier (petite pause de 300 millisecondes avant d'agir).

---

## 6. images.json

Fichier de données pur (pas de code), généré automatiquement. Exemple de contenu :
```json
[
  {
    "name": "Pochette Wax Indigo",
    "price": 4500,
    "badge": "Fait main",
    "image": "images/4500_Pochette-Wax-Indigo_Fait-main.jpg",
    "stock": 4
  }
]
```
Ne jamais l'éditer à la main : la prochaine exécution de `build-catalogue.js`
écrasera tes modifications. Le champ `stock` vient de `stock.json` (voir section suivante),
pas du nom du fichier.

---

## 7. stock.json

Autre fichier de données pur, qui garde le nombre de pièces disponibles pour chaque
photo. Exemple :
```json
{
  "4500_Pochette-Wax-Indigo_Fait-main.jpg": 4,
  "6000_Pochette-Cuir-Suedine.jpg": 5
}
```
Contrairement à `images.json`, ce fichier n'est **jamais régénéré depuis zéro** —
seules les commandes `--vendu` et `--stock` (ou l'ajout d'une nouvelle photo) le
modifient. C'est ce qui permet au stock de survivre entre deux exécutions normales
de `node build-catalogue.js`.

---

## 8. images/LISEZ-MOI.txt

Simple aide-mémoire texte, présent physiquement dans le dossier `images/` pour
que la convention de nommage soit toujours sous les yeux au moment de déposer
une photo, même sans rouvrir ce guide. Contient aussi le rappel des commandes
`--vendu` et `--stock` pour la gestion du stock.
