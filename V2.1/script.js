// ====== CONFIGURATION À MODIFIER PAR LE DÉVELOPPEUR ======
const WHATSAPP_NUMBER = "2290144083837"; // remplace par le vrai numéro, format international sans le +
const DEFAULT_MESSAGE = "Bonjour, je viens du site Pochettes Chic et je voudrais passer une commande.";

// Lien CSV du Google Sheet rempli par le vendeur (voir instructions de mise en place).
// Laisse vide ("") pour n'utiliser que le catalogue manuel PRODUCTS ci-dessous.
const SHEET_CSV_URL = "";

// Fichier généré par build-catalogue.js à partir du dossier images/.
// Laisse tel quel — c'est le catalogue que TOI tu gères en déposant des photos.
const LOCAL_CATALOGUE_URL = "images.json";

const PRODUCTS_POCHETTES = [
  {
      "name": "Pochette iphone 11",
      "price": 1500,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/1500_Pochette-iphone-11.jpg",
      "stock": 5
    },
    {
      "name": "pochette noir",
      "price": 1500,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/1500_pochette-noir.jpg",
      "stock": 5
    },
    {
      "name": "pochette simple",
      "price": 1500,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/1500_pochette-simple.jpg",
      "stock": 5
    },
    {
      "name": "pochette",
      "price": 1500,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/1500_pochette.jpg",
      "stock": 5
    },
    {
      "name": "pochette1",
      "price": 1500,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/1500_pochette1.jpg",
      "stock": 5
    },
    {
      "name": "Pochette a une main",
      "price": 2000,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/2000_Pochette-a-une-main.jpg",
      "stock": 5
    },
    {
      "name": "Pochette iphone 13",
      "price": 2000,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/2000_Pochette-iphone-13.jpg",
      "stock": 5
    },
    {
      "name": "Pochette multi telephone",
      "price": 2000,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/2000_Pochette-multi-telephone.jpg",
      "stock": 5
    },
    {
      "name": "pochette a rabat couleurs",
      "price": 2500,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/2500_pochette-a-rabat-couleurs.jpg",
      "stock": 5
    },
    {
      "name": "pochette a rabat",
      "price": 2500,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/2500_pochette-a-rabat.jpg",
      "stock": 5
    },
    {
      "name": "Pochette iphone 13 pro",
      "price": 2500,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/2500_Pochette-iphone-13-pro.jpg",
      "stock": 5
    },
    {
      "name": "Pochette iphone",
      "price": 2500,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/2500_Pochette-iphone.jpg",
      "stock": 5
    },
    {
      "name": "Pochette iphone design bois",
      "price": 3000,
      "badge": "",
      "category": "pochettes",
      "image": "images/pochettes/3000_Pochette-iphone-design-bois.jpg",
      "stock": 5
    }
];
const PRODUCTS_INCASSABLE=[
    {
      "name": "Coque incassable",
      "price": 1000,
      "badge": "",
      "category": "incassable",
      "image": "images/incassable/1000_Coque-incassable.jpg",
      "stock": 5
    },
    {
      "name": "Coque incassable",
      "price": 1500,
      "badge": "",
      "category": "incassable",
      "image": "images/incassable/1500_Coque-incassable.jpg",
      "stock": 5
    }
  ];
const PRODUCTS_CHARGEUR=[
   {
      "name": "chargeur C",
      "price": 1000,
      "badge": "",
      "category": "chargeur",
      "image": "images/chargeur/1000_chargeur-C.jpg",
      "stock": 5
    },
    {
      "name": "Chargeur de qualité",
      "price": 1000,
      "badge": "",
      "category": "chargeur",
      "image": "images/chargeur/1000_Chargeur-de-qualité.jpg",
      "stock": 5
    },
    {
      "name": "fil de chargeur",
      "price": 1000,
      "badge": "",
      "category": "chargeur",
      "image": "images/chargeur/1000_fil-de-chargeur.jpg",
      "stock": 5
    },
    {
      "name": "usb chargeur particulier",
      "price": 1000,
      "badge": "",
      "category": "chargeur",
      "image": "images/chargeur/1000_usb-chargeur-particulier.jpg",
      "stock": 5
    },
    {
      "name": "ecouteur sans fil",
      "price": 2000,
      "badge": "",
      "category": "chargeur",
      "image": "images/chargeur/2000_ecouteur-sans-fil.jpg",
      "stock": 5
    },
    {
      "name": "ecouteurs sans fil",
      "price": 2000,
      "badge": "",
      "category": "chargeur",
      "image": "images/chargeur/2000_ecouteurs-sans-fil.jpg",
      "stock": 5
    },
    {
      "name": "tete chargeur qualité",
      "price": 500,
      "badge": "",
      "category": "chargeur",
      "image": "images/chargeur/500_tete-chargeur-qualité.jpg",
      "stock": 5
    },
    {
      "name": "tete de chargeur",
      "price": 500,
      "badge": "",
      "category": "chargeur",
      "image": "images/chargeur/500_tete-de-chargeur.jpg",
      "stock": 5
    }];
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

function stockMessage(stock){
  if (stock === undefined || stock === null) return '';
  if (stock <= 0) return `<p class="stock stock-out">Rupture de stock</p>`;
  if (stock <= 2) return `<p class="stock stock-low">Plus que ${stock} en stock !</p>`;
  return `<p class="stock">${stock} en stock</p>`;
}

function renderCard(p){
  const media = p.image
    ? `<img class="card-img" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.closest('.card').querySelector('.card-img').outerHTML='<div class=\\'card-img s1\\'></div>'">`
    : `<div class="card-img ${p.tag || 's1'}"></div>`;
  const priceLabel = p.price ? `${p.price.toLocaleString('fr-FR')} FCFA` : '';
  const outOfStock = p.stock !== undefined && p.stock <= 0;
  const orderMsg = 'Bonjour, je suis intéressé(e) par la ' + p.name + (p.price ? ' à ' + priceLabel : '') + '. Est-elle disponible ?';
  const orderBtn = outOfStock
    ? `<span class="order-btn order-btn-disabled">Rupture de stock</span>`
    : `<a class="order-btn" href="${waLink(orderMsg)}" target="_blank" rel="noopener">Commander</a>`;

  return `
    <div class="card">
      ${media}
      <div class="card-body">
        <h3>${p.name}</h3>
        ${p.occasion ? `<p style="color:var(--muted);font-size:.9rem;margin:0;">Idéale pour : ${p.occasion}</p>` : ''}
        ${p.badge ? `<p style="color:var(--leaf);font-size:.88rem;font-weight:600;margin:0;">✨ ${p.badge}</p>` : ''}
        ${priceLabel ? `<div class="price">${priceLabel}</div>` : ''}
        ${stockMessage(p.stock)}
        ${orderBtn}
      </div>
    </div>`;
}

function renderCatalogue(items){
  document.getElementById('catalogueGrid').innerHTML = items.map(renderCard).join('');
}

function buildCatalogue1(){
  // Affiche d'abord le catalogue manuel pendant le chargement (évite un écran vide).
  renderCatalogue(PRODUCTS_POCHETTES);

  /*if (LOCAL_CATALOGUE_URL) {
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
  }*/

}
function renderCatalogue2(items){
  document.getElementById('chargeurGrid').innerHTML = items.map(renderCard).join('');
}
function buildCatalogue2(){
  renderCatalogue2(PRODUCTS_INCASSABLE);
}
function renderCatalogue3(items){
  document.getElementById('incassableGrid').innerHTML = items.map(renderCard).join('');
}
function buildCatalogue3(){
  renderCatalogue3(PRODUCTS_CHARGEUR);
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
buildCatalogue1();
buildCatalogue2();
buildCatalogue3();
buildTestimonials();
buildStarWidgets();
wireReviewForm();
wireGeneralLinks();
