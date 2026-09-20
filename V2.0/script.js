// ====== CONFIGURATION À MODIFIER PAR LE DÉVELOPPEUR ======
const WHATSAPP_NUMBER = "2290144083837"; // remplace par le vrai numéro, format international sans le +
const DEFAULT_MESSAGE = "Bonjour, je viens du site Pochettes Chic et je voudrais passer une commande.";

// Lien CSV du Google Sheet rempli par le vendeur (voir instructions de mise en place).
// Laisse vide ("") pour n'utiliser que le catalogue manuel PRODUCTS ci-dessous.
const SHEET_CSV_URL = "";

// Fichier généré par build-catalogue.js à partir du dossier images/.
// Laisse tel quel — c'est le catalogue que TOI tu gères en déposant des photos.
const LOCAL_CATALOGUE_URL = "images.json";

const PRODUCTS = [
  { name: "Pochette Wax Indigo", price: 4500, tag: "s1" },
  { name: "Pochette Cuir Suédine", price: 6000, tag: "s2" },
  { name: "Pochette Perlée Soirée", price: 5500, tag: "s3" },
  { name: "Pochette Bandoulière Kaki", price: 5000, tag: "s4" },
  { name: "Pochette Mini Chic", price: 3500, tag: "s5" },
  { name: "Pochette Grand Format", price: 7000, tag: "s6" },
];
// Témoignages affichés sur le site : copie ici les meilleurs avis reçus sur WhatsApp
const TESTIMONIALS = [
  // { name: "Fatou", site: 5, vendeur: 5, marchandise: 5, quote: "Commande reçue le jour même, pochette magnifique." },
];
// ===========================================================

function waLink(message){
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Construit une phrase en français à partir des menus déroulants remplis par le vendeur,
// pour qu'il n'ait jamais à rédiger lui-même une description.
function buildDescriptionFromRow(row){
  const couleur = (row['Couleur'] || '').trim();
  const matiere = (row['Matière'] || '').trim();
  const occasion = (row['Occasion'] || '').trim();
  let name = 'Pochette';
  if (couleur) name += ' ' + couleur;
  if (matiere) name += ' en ' + matiere;
  return { name, occasion };
}

function parsePrice(value){
  const digits = String(value || '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

function renderCard(p){
  const media = p.image
    ? `<img class="card-img" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.closest('.card').querySelector('.card-img').outerHTML='<div class=\\'card-img s1\\'></div>'">`
    : `<div class="card-img ${p.tag || 's1'}"></div>`;
  const priceLabel = p.price ? `${p.price.toLocaleString('fr-FR')} FCFA` : '';
  const orderMsg = 'Bonjour, je suis intéressé(e) par la ' + p.name + (p.price ? ' à ' + priceLabel : '') + '. Est-elle disponible ?';
  return `
    <div class="card">
      ${media}
      <div class="card-body">
        <h3>${p.name}</h3>
        ${p.occasion ? `<p style="color:var(--muted);font-size:.9rem;margin:0;">Idéale pour : ${p.occasion}</p>` : ''}
        ${p.badge ? `<p style="color:var(--leaf);font-size:.88rem;font-weight:600;margin:0;">✨ ${p.badge}</p>` : ''}
        ${priceLabel ? `<div class="price">${priceLabel}</div>` : ''}
        <a class="order-btn" href="${waLink(orderMsg)}" target="_blank" rel="noopener">Commander</a>
      </div>
    </div>`;
}

function renderCatalogue(items){
  document.getElementById('catalogueGrid').innerHTML = items.map(renderCard).join('');
}

function buildCatalogue(){
  // Affiche d'abord le catalogue manuel pendant le chargement (évite un écran vide).
  renderCatalogue(PRODUCTS);

  if (LOCAL_CATALOGUE_URL) {
    fetch(LOCAL_CATALOGUE_URL)
      .then(res => {
        if (!res.ok) throw new Error('images.json introuvable');
        return res.json();
      })
      .then(items => {
        if (Array.isArray(items) && items.length > 0) {
          renderCatalogue(items);
        } else if (SHEET_CSV_URL) {
          loadFromSheet();
        }
      })
      .catch(() => {
        // Probablement ouvert en double-clic (file://) plutôt que via un serveur local —
        // ou aucune photo ajoutée pour l'instant. On retente le Sheet si configuré.
        if (SHEET_CSV_URL) loadFromSheet();
      });
    return;
  }

  if (SHEET_CSV_URL) loadFromSheet();
}

function loadFromSheet(){
  Papa.parse(SHEET_CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const rows = (results.data || []).filter(r => r['Lien de la photo']);
      if (rows.length === 0) return; // rien de valide reçu, on garde le catalogue manuel

      const fromSheet = rows.map(row => {
        const { name, occasion } = buildDescriptionFromRow(row);
        return {
          name,
          occasion,
          price: parsePrice(row['Prix']),
          image: (row['Lien de la photo'] || '').trim(),
          badge: (row['Point fort'] || '').trim(),
        };
      });

      renderCatalogue([...fromSheet, ...PRODUCTS]);
    },
    error: () => {
      // En cas d'échec réseau, le catalogue manuel déjà affiché reste en place.
    }
  });
}

function wireGeneralLinks(){
  document.querySelectorAll('.order-link, #navOrder, #footWhatsapp').forEach(el => {
    el.href = waLink(DEFAULT_MESSAGE);
  });
}

function starsAsText(n){
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function buildTestimonials(){
  const grid = document.getElementById('temoignagesGrid');
  if (!grid) return;
  if (TESTIMONIALS.length === 0){
    grid.innerHTML = '<p style="color:var(--muted)">Les premiers avis clients arrivent bientôt.</p>';
    return;
  }
  grid.innerHTML = TESTIMONIALS.map(t => `
    <div class="card testi-card">
      <div class="testi-stars">Site ${starsAsText(t.site)} · Vendeur ${starsAsText(t.vendeur)} · Article ${starsAsText(t.marchandise)}</div>
      ${t.quote ? `<p class="testi-quote">"${t.quote}"</p>` : ''}
      <div class="testi-name">${t.name}</div>
    </div>
  `).join('');
}

// Construit un widget de 5 étoiles cliquables dans chaque .stars, valeur stockée dans data-value
function buildStarWidgets(){
  document.querySelectorAll('.stars').forEach(container => {
    container.dataset.value = "0";
    container.innerHTML = [1,2,3,4,5].map(i =>
      `<button type="button" data-star="${i}" aria-label="${i} étoile(s)">★</button>`
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

function wireReviewForm(){
  const form = document.getElementById('reviewForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewName').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    const siteNote = Number(form.querySelector('[data-target="siteNote"]').dataset.value || 0);
    const vendeurNote = Number(form.querySelector('[data-target="vendeurNote"]').dataset.value || 0);
    const marchandiseNote = Number(form.querySelector('[data-target="marchandiseNote"]').dataset.value || 0);

    const note = document.getElementById('formNote');

    if (!name || siteNote === 0 || vendeurNote === 0 || marchandiseNote === 0){
      note.textContent = "Merci de renseigner votre nom et les 3 notes avant d'envoyer.";
      note.style.color = "var(--brick)";
      return;
    }

    const message = [
      `Avis client — Pochettes Chic`,
      `Nom : ${name}`,
      `Note site : ${starsAsText(siteNote)}`,
      `Note vendeur : ${starsAsText(vendeurNote)}`,
      `Note marchandise : ${starsAsText(marchandiseNote)}`,
      comment ? `Commentaire : ${comment}` : null,
    ].filter(Boolean).join('\n');

    window.open(waLink(message), '_blank', 'noopener');

    note.textContent = "Merci ! Votre avis vient de s'ouvrir dans WhatsApp — appuyez sur envoyer pour le confirmer.";
    note.style.color = "var(--leaf)";
    form.reset();
    form.querySelectorAll('.stars').forEach(c => {
      c.dataset.value = "0";
      c.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    });
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
buildCatalogue();
buildTestimonials();
buildStarWidgets();
wireReviewForm();
wireGeneralLinks();
