window.newOrderCode = () => {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = crypto.getRandomValues(new Uint8Array(6));
  return 'PC-' + [...r].map(n => a[n % a.length]).join('');
};
window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(function(){
  const $ = id => document.getElementById(id);
  const mapEl = $('contact-map'), status = $('trackStatus'), input = $('trackCode');
  if (!mapEl || !window.L) return;
  const say = t => status.textContent = t;
  const pin = e => L.divIcon({className:'pin', html:e, iconSize:[34,34], iconAnchor:[17,17]});
  const map = L.map(mapEl, {scrollWheelZoom:false}).setView(BASE_POINT, 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'© OpenStreetMap'}).addTo(map);
  L.marker(BASE_POINT, {icon:pin('📍'), title:'Point de départ'}).addTo(map);

  let rider = null, me = null, meMarker = null, trail = L.polyline([], {color:'#B84A2F', weight:4}).addTo(map), poll = null;

  const km = (a, b) => {
    const r = x => x * Math.PI / 180, dLa = r(b[0]-a[0]), dLo = r(b[1]-a[1]);
    const h = Math.sin(dLa/2)**2 + Math.cos(r(a[0]))*Math.cos(r(b[0]))*Math.sin(dLo/2)**2;
    return 12742 * Math.asin(Math.sqrt(h));
  };
  const update = st => {
    if (!st) return say('Pas encore de livraison en cours pour ce code.');
    if (st.done) { clearInterval(poll); return say('Livraison terminée. Merci pour votre commande !'); }
    if (typeof st.lat !== 'number') return say('En attente du départ du livreur…');
    const p = [st.lat, st.lng];
    if (!rider) rider = L.marker(p, {icon:pin('🛵'), title:'Livreur'}).addTo(map);
    rider.setLatLng(p); trail.addLatLng(p);
    map.fitBounds(L.latLngBounds(me ? [p, me] : [p, BASE_POINT]).pad(.3), {maxZoom:16});
    const age = Math.round((Date.now() - new Date(st.position_updated_at).getTime()) / 60000);
    let t = 'Livreur en route';
    if (me) { const d = km(p, me); t += ` — à ${d < 1 ? Math.round(d*1000)+' m' : d.toFixed(1)+' km'}, environ ${Math.max(1, Math.round(d/20*60))} min`; }
    say(age >= 2 ? t + ` (position vue il y a ${age} min)` : t);
  };
  const follow = code => {
    code = code.trim().toUpperCase();
    if (!/^PC-[A-Z0-9]{6}$/.test(code)) return say('Code invalide. Il ressemble à PC-7K4M2Q.');
    clearInterval(poll); rider && (map.removeLayer(rider), rider = null); trail.setLatLngs([]);
    say('Recherche du livreur…');
    const check = () => window.sb.rpc('get_order_status', { order_code: code }).then(({data}) => update(data && data[0]));
    check();
    poll = setInterval(check, 5000);
  };
  $('trackForm').addEventListener('submit', e => { e.preventDefault(); follow(input.value); });
  $('locateBtn').addEventListener('click', () => {
    if (!navigator.geolocation) return say('Votre navigateur ne permet pas la localisation.');
    navigator.geolocation.getCurrentPosition(pos => {
      me = [pos.coords.latitude, pos.coords.longitude];
      meMarker ? meMarker.setLatLng(me) : meMarker = L.marker(me, {icon:pin('🏠'), title:'Vous'}).addTo(map);
      map.setView(me, 15); say('Votre position est affichée.');
    }, () => say("Localisation refusée. Autorisez-la dans votre navigateur pour afficher l'ETA."));
  });
  window.showOrderCode = code => { input.value = code; say(`Votre code de suivi : ${code}. Gardez-le pour suivre la livraison ici.`); };
  const q = new URLSearchParams(location.search).get('suivi');
  if (q) { input.value = q.toUpperCase(); follow(q); }
})();