/* ---------- State ---------- */
const STORE_KEY = "sdv-bundle-tracker-v1";
const GOLD_KEY  = "sdv-gold";
const SET_KEY   = "sdv-settings";
let checked = {};
let gold = 0;
let settings = { dark:false, sound:false, petals:true };
let hideDone = false;
let filterMode = "all";   // all | nocart | tricky
let currentSeason = "";   // "" | Spring | Summer | Fall | Winter
let searchTerm = "";
let activeView = "bundle";
let todaySeason = "Spring";
let todayWeather = "Sunny";

function load(){
  try { checked = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { checked = {}; }
  gold = parseInt(localStorage.getItem(GOLD_KEY),10) || 0;
  try { settings = Object.assign(settings, JSON.parse(localStorage.getItem(SET_KEY)) || {}); } catch {}
}
function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(checked)); }
function saveGold(){ localStorage.setItem(GOLD_KEY, String(gold)); }
function saveSettings(){ localStorage.setItem(SET_KEY, JSON.stringify(settings)); }

/* ---------- Helpers ---------- */
const SEASON_ORDER = ["Spring","Summer","Fall","Winter","Any"];
const SEASON_META = {
  Spring:{emoji:"🌸",label:"Spring"}, Summer:{emoji:"🌻",label:"Summer"},
  Fall:{emoji:"🍂",label:"Fall"}, Winter:{emoji:"❄️",label:"Winter"},
  Any:{emoji:"🗓️",label:"Any Season / No Requirement"}
};
function slotId(bundle, i){ return bundle.id + "-" + i; }
function imgSrc(item){ return "images/" + item.img + ".png"; }
function goldAmount(name){ const m = name.replace(/,/g,"").match(/(\d+)g/); return m ? +m[1] : 0; }

/* ---------- Item row ---------- */
function itemRow(item, sid, bundleName){
  const el = document.createElement("label");
  el.className = "item" + (checked[sid] ? " done":"");
  el.dataset.slot = sid;
  el.dataset.cart = String(item.cart);
  el.dataset.hard = item.hard ? "1" : "0";
  el.dataset.seasons = item.seasons.join(",");
  el.dataset.search = (item.name + " " + item.how).toLowerCase();

  const box = document.createElement("span");
  box.className = "box"; box.textContent = checked[sid] ? "✓" : "";

  const sprite = document.createElement("img");
  sprite.className = "sprite"; sprite.src = imgSrc(item); sprite.alt = item.name; sprite.loading = "lazy";
  sprite.onerror = () => { sprite.style.visibility = "hidden"; };

  const meta = document.createElement("div"); meta.className = "meta";
  const nm = document.createElement("div"); nm.className = "nm"; nm.append(document.createTextNode(item.name));
  const how = document.createElement("div"); how.className = "how"; how.textContent = item.how;
  const tags = document.createElement("div"); tags.className = "tags";
  const addTag = (cls, txt) => { const t=document.createElement("span"); t.className="tag "+cls; t.textContent=txt; tags.append(t); };
  if (item.qty) addTag("qty", "×"+item.qty);
  if (item.quality) addTag("gold", "★ "+item.quality);
  item.seasons.forEach(s => addTag("s-"+s, SEASON_META[s] ? SEASON_META[s].label.split(" ")[0] : s));
  if (item.req) addTag("req", item.req);
  if (item.cart === false) addTag("nocart", "🚫 Cart");
  else if (item.hard) addTag("tricky", "🔥 Tricky");
  if (bundleName) addTag("bundleref", bundleName);

  meta.append(nm, how, tags);
  el.append(box, sprite, meta);
  el.addEventListener("click", (e)=>{ e.preventDefault(); toggle(sid); });
  return el;
}

/* ---------- Toggle + sync ---------- */
function toggle(sid){
  const turningOn = !checked[sid];
  checked[sid] = turningOn ? true : undefined;
  if (!turningOn) delete checked[sid];
  save();
  document.querySelectorAll('[data-slot="'+sid+'"]').forEach(el=>{
    el.classList.toggle("done", turningOn);
    el.querySelector(".box").textContent = turningOn ? "✓" : "";
  });
  if (turningOn && settings.sound) playPop();
  refreshProgress();
  applyView();
  if (activeView === "cart") renderCart();
  if (activeView === "today") renderToday();
}

/* ---------- Bundle view ---------- */
function renderBundles(){
  const root = document.getElementById("bundleView");
  root.innerHTML = "";
  DATA.rooms.forEach(room=>{
    const section = document.createElement("section");
    section.className = "room-section"; section.dataset.room = room.id;
    const head = document.createElement("div");
    head.className = "room-head";
    head.innerHTML = `<span class="emoji">${room.emoji}</span><h2>${room.name}</h2><span class="reward">🎁 ${room.reward}</span>`;
    section.append(head);

    if (room.id === "vault") section.append(buildVaultGold(room));

    const grid = document.createElement("div"); grid.className = "bundles";
    room.bundles.forEach(bundle=>{
      const card = document.createElement("div");
      card.className = "bundle"; card.dataset.bundle = bundle.id;
      const h3 = document.createElement("h3");
      h3.innerHTML = `${bundle.name} <span class="need">need ${bundle.need}/${bundle.items.length}</span>`;
      const reward = document.createElement("div"); reward.className = "reward"; reward.textContent = "🎁 " + bundle.reward;
      card.append(h3, reward);
      if (bundle.note){ const n=document.createElement("div"); n.className="bnote"; n.textContent="⚠ "+bundle.note; card.append(n); }
      const prog = document.createElement("div"); prog.className = "bprog"; prog.innerHTML = '<div class="f"></div>';
      card.append(prog);
      const list = document.createElement("div"); list.className = "items";
      bundle.items.forEach((item,i)=> list.append(itemRow(item, slotId(bundle,i), null)));
      card.append(list);
      grid.append(card);
    });
    section.append(grid);
    root.append(section);
  });
}

/* ---------- Vault gold tracker ---------- */
function buildVaultGold(room){
  const tiers = room.bundles[0].items.map((it)=>({ name:it.name, amount:goldAmount(it.name) }));
  const wrap = document.createElement("div");
  wrap.className = "vault-gold";
  wrap.innerHTML = `<h3>💰 Gold Tracker</h3>
    <div class="gold-input"><label>I currently have</label>
      <input id="goldInput" type="number" min="0" step="100" value="${gold}"> <span>g</span></div>
    <div class="gold-note" id="goldNote"></div>`;
  // Need to attach listener after insertion; do it now on the element directly.
  const input = wrap.querySelector("#goldInput");
  input.addEventListener("input", ()=>{ gold = Math.max(0, parseInt(input.value,10)||0); saveGold(); updateGoldNote(tiers); });
  // store tiers for later refresh
  wrap._tiers = tiers;
  setTimeout(()=>updateGoldNote(tiers),0);
  return wrap;
}
function updateGoldNote(tiers){
  const note = document.getElementById("goldNote");
  if (!note) return;
  const TOTAL = 42500;
  const afford = tiers.filter(t=>gold>=t.amount).length;
  const deposited = DATA.rooms.find(r=>r.id==="vault").bundles[0].items
      .reduce((s,it,i)=> s + (checked["vault-money-"+i] ? goldAmount(it.name):0), 0);
  note.innerHTML =
    `You can afford <b>${afford} of 4</b> tiers right now.<br>` +
    `Deposited so far: <b>${deposited.toLocaleString()}g</b> / ${TOTAL.toLocaleString()}g ` +
    `(${Math.round(deposited/TOTAL*100)}%).`;
}

/* ---------- Season view ---------- */
function renderSeasons(){
  const root = document.getElementById("seasonView");
  root.innerHTML = "";
  const buckets = {Spring:[],Summer:[],Fall:[],Winter:[],Any:[]};
  DATA.rooms.forEach(room=> room.bundles.forEach(bundle=>{
    bundle.items.forEach((item,i)=>{
      const sid = slotId(bundle,i); const label = room.emoji + " " + bundle.name;
      item.seasons.forEach(s=>{ if (buckets[s]) buckets[s].push({item, sid, label}); });
    });
  }));
  SEASON_ORDER.forEach(s=>{
    const arr = buckets[s]; if (!arr.length) return;
    const section = document.createElement("section"); section.className = "season-section";
    const head = document.createElement("div"); head.className = "season-head";
    head.innerHTML = `<span class="emoji">${SEASON_META[s].emoji}</span><h2>${SEASON_META[s].label}</h2><span class="sub">${arr.length} item slots</span>`;
    section.append(head);
    const grid = document.createElement("div"); grid.className = "items season-list";
    arr.forEach(o=> grid.append(itemRow(o.item, o.sid, o.label)));
    section.append(grid);
    root.append(section);
  });
}

/* ---------- Cart list ---------- */
function renderCart(){
  const root = document.getElementById("cartView");
  root.innerHTML = "";
  const intro = document.createElement("div");
  intro.className = "cart-intro";
  intro.innerHTML = `<b>🛒 Your Traveling Cart shopping list.</b> Items you still need that the Cart <i>can</i> sell (Fri &amp; Sun in Cindersap Forest, plus the Night Market). Tap one when you buy it to check it off.`;
  root.append(intro);

  // aggregate unchecked, cart-buyable slots by item
  const groups = new Map();
  DATA.rooms.forEach(room=> room.bundles.forEach(bundle=>{
    bundle.items.forEach((item,i)=>{
      const sid = slotId(bundle,i);
      if (checked[sid]) return;
      if (item.cart !== true) return;            // exclude no-Cart (false) and vault (null)
      const key = item.img + "|" + item.name + "|" + (item.quality||"");
      if (!groups.has(key)) groups.set(key, { item, slots:[], bundles:new Set() });
      const g = groups.get(key); g.slots.push(sid); g.bundles.add(room.emoji+" "+bundle.name);
    });
  }));

  let list = [...groups.values()].sort((a,b)=>a.item.name.localeCompare(b.item.name));
  if (searchTerm) list = list.filter(g => (g.item.name+" "+g.item.how).toLowerCase().includes(searchTerm));

  if (!list.length){
    const m = document.createElement("div"); m.className="empty-msg";
    m.textContent = searchTerm ? "No matching Cart items 🔎" : "Nothing left for the Cart — you legend! 🎉";
    root.append(m); return;
  }
  const wrap = document.createElement("div"); wrap.className = "cart-list";
  list.forEach(g=>{
    const row = document.createElement("div"); row.className = "cart-row";
    const sprite = document.createElement("img"); sprite.className="sprite"; sprite.src=imgSrc(g.item); sprite.alt=g.item.name; sprite.onerror=()=>sprite.style.visibility="hidden";
    const meta = document.createElement("div"); meta.className="meta";
    const nm = document.createElement("div"); nm.className="nm";
    nm.textContent = g.item.name + (g.slots.length>1 ? `  ×${g.slots.length} still needed` : "");
    const sub = document.createElement("div"); sub.className="sub"; sub.textContent = [...g.bundles].join(" · ");
    const tags = document.createElement("div"); tags.className="tags";
    const addTag=(c,t)=>{const s=document.createElement("span");s.className="tag "+c;s.textContent=t;tags.append(s);};
    g.item.seasons.forEach(s=>addTag("s-"+s, SEASON_META[s]?SEASON_META[s].label.split(" ")[0]:s));
    if (g.item.req) addTag("req", g.item.req);
    if (g.item.hard) addTag("tricky","🔥 Tricky");
    meta.append(nm, sub, tags);
    const buy = document.createElement("span"); buy.className="buy"; buy.textContent="✓ bought one";
    row.append(sprite, meta, buy);
    row.addEventListener("click", ()=> toggle(g.slots[0]));   // check the first remaining
    wrap.append(row);
  });
  root.append(wrap);
}

/* ---------- Today view ---------- */
function renderToday(){
  const root = document.getElementById("todayView");
  root.innerHTML = "";
  // controls
  const ctl = document.createElement("div"); ctl.className = "today-controls";
  ctl.innerHTML =
    `<div class="ctl-group"><span class="ctl-label">Season</span>` +
      ["Spring","Summer","Fall","Winter"].map(s=>`<button class="chip tday-season ${s===todaySeason?"active":""}" data-s="${s}">${SEASON_META[s].emoji} ${s}</button>`).join("") +
    `</div>` +
    `<div class="ctl-group"><span class="ctl-label">Weather</span>` +
      [["Sunny","☀️"],["Rain","🌧️"]].map(([w,e])=>`<button class="chip weather tday-weather ${w===todayWeather?"active":""}" data-w="${w}">${e} ${w}</button>`).join("") +
    `</div>`;
  root.append(ctl);
  ctl.querySelectorAll(".tday-season").forEach(b=> b.onclick=()=>{ todaySeason=b.dataset.s; renderToday(); });
  ctl.querySelectorAll(".tday-weather").forEach(b=> b.onclick=()=>{ todayWeather=b.dataset.w; renderToday(); });

  const intro = document.createElement("div"); intro.className="today-intro";
  intro.innerHTML = `<b>What can I grab right now?</b> Still-needed items available in <b>${todaySeason}</b> on a <b>${todayWeather.toLowerCase()}</b> day. Fish show their time window.`;
  root.append(intro);

  const matches = [];
  DATA.rooms.forEach(room=> room.bundles.forEach(bundle=>{
    bundle.items.forEach((item,i)=>{
      const sid = slotId(bundle,i);
      if (checked[sid]) return;
      const inSeason = item.seasons.includes(todaySeason) || item.seasons.includes("Any");
      if (!inSeason) return;
      const req = (item.req||"");
      if (/Rain/i.test(req) && todayWeather!=="Rain") return;
      if (/Sunny/i.test(req) && todayWeather!=="Sunny") return;
      if (searchTerm && !(item.name+" "+item.how).toLowerCase().includes(searchTerm)) return;
      matches.push({item, sid, label: room.emoji+" "+bundle.name});
    });
  }));

  if (!matches.length){
    const m=document.createElement("div"); m.className="empty-msg";
    m.textContent = "Nothing left to grab for these conditions — go relax! 🍵";
    root.append(m); return;
  }
  const grid = document.createElement("div"); grid.className="today-list";
  matches.forEach(o=> grid.append(itemRow(o.item, o.sid, o.label)));
  root.append(grid);
}

/* ---------- Progress + room bar + celebrations ---------- */
let prevComplete = {}, suppressConfetti = true;
function refreshProgress(){
  let total=0, done=0;
  DATA.rooms.forEach(room=> room.bundles.forEach(bundle=>{
    let c=0;
    bundle.items.forEach((item,i)=>{ total++; if(checked[slotId(bundle,i)]){done++; c++;} });
    const isComplete = c >= bundle.need;
    const card = document.querySelector('.bundle[data-bundle="'+bundle.id+'"]');
    if (card){
      card.classList.toggle("complete", isComplete);
      card.querySelector(".bprog .f").style.width = Math.min(100, Math.round(c/bundle.need*100)) + "%";
      card.querySelector(".need").textContent = `${Math.min(c,bundle.need)}/${bundle.need}` + (c>bundle.need?` (+${c-bundle.need})`:"");
    }
    if (!suppressConfetti && isComplete && !prevComplete[bundle.id]){ fireConfetti(); if (settings.sound) playFanfare(); }
    prevComplete[bundle.id] = isComplete;
  }));
  suppressConfetti = false;
  const pct = total ? Math.round(done/total*100) : 0;
  document.getElementById("overallFill").style.width = pct + "%";
  document.getElementById("overallLabel").textContent = `${done} / ${total} item slots collected · ${pct}%`;
  updateRoomsBar();
  updateMascot(pct);
  if (DATA.rooms.find(r=>r.id==="vault")) updateGoldNote(
    DATA.rooms.find(r=>r.id==="vault").bundles[0].items.map(it=>({name:it.name,amount:goldAmount(it.name)})));
}

function updateMascot(pct){
  const el = document.getElementById("mascotMsg"); if(!el) return;
  let msg;
  if (pct>=100) msg = "The Junimos are overjoyed!! 🎉🌟";
  else if (pct>=80) msg = "So close I can taste the Pink Cake! 🍰";
  else if (pct>=60) msg = "Over halfway — keep blooming! 🌷";
  else if (pct>=35) msg = "Lookin' great, farmer! 🌻";
  else if (pct>=10) msg = "Off to a lovely start! 🌱";
  else msg = "Let's fill these bundles! 🌱";
  el.textContent = msg;
}

function updateRoomsBar(){
  const bar = document.getElementById("roomsBar");
  if (!bar.dataset.built){
    DATA.rooms.forEach(room=>{
      const chip = document.createElement("button");
      chip.className = "room-chip"; chip.dataset.room = room.id; chip.title = "🎁 " + room.reward;
      chip.innerHTML = `<span class="re">${room.emoji}</span><span class="rc-meta"><b>${room.name}</b><span class="rc-prog"></span></span>`;
      chip.onclick = ()=>{ switchView("bundle");
        const sec = document.querySelector('.room-section[data-room="'+room.id+'"]');
        if (sec) sec.scrollIntoView({behavior:"smooth", block:"start"}); };
      bar.append(chip);
    });
    bar.dataset.built = "1";
  }
  DATA.rooms.forEach(room=>{
    let done=0;
    room.bundles.forEach(b=>{ let c=0; b.items.forEach((it,i)=>{ if(checked[slotId(b,i)]) c++; }); if(c>=b.need) done++; });
    const total = room.bundles.length;
    const chip = bar.querySelector('.room-chip[data-room="'+room.id+'"]');
    const complete = done >= total;
    chip.classList.toggle("complete", complete);
    chip.querySelector(".rc-prog").textContent = complete ? "✓ unlocked!" : `${done}/${total} bundles`;
  });
}

/* ---------- Filters / search / season highlight (bundle + season views) ---------- */
function applyView(){
  document.querySelectorAll("#bundleView .item, #seasonView .item").forEach(el=>{
    const done = el.classList.contains("done");
    const cart = el.dataset.cart, hard = el.dataset.hard==="1";
    const seasons = el.dataset.seasons.split(","), isAny = seasons.includes("Any");
    let show = true;
    if (hideDone && done) show = false;
    if (show && filterMode==="nocart" && cart!=="false") show = false;
    if (show && filterMode==="tricky" && !(cart==="false"||hard)) show = false;
    if (show && searchTerm && !el.dataset.search.includes(searchTerm)) show = false;
    el.style.display = show ? "" : "none";
    el.classList.toggle("dim", (!!currentSeason && !isAny && !seasons.includes(currentSeason)) && show);
  });
  document.querySelectorAll(".bundle").forEach(card=>{
    card.style.display = [...card.querySelectorAll(".item")].some(i=>i.style.display!=="none") ? "" : "none";
  });
  document.querySelectorAll("#bundleView .room-section").forEach(sec=>{
    // keep vault visible if it has a gold panel and any visible bundle; otherwise collapse if no visible bundles
    sec.style.display = [...sec.querySelectorAll(".bundle")].some(c=>c.style.display!=="none") ? "" : "none";
  });
  document.querySelectorAll(".season-section").forEach(sec=>{
    sec.style.display = [...sec.querySelectorAll(".item")].some(i=>i.style.display!=="none") ? "" : "none";
  });
}

/* ---------- Views / tabs ---------- */
function switchView(which){
  activeView = which;
  ["bundle","season","cart","today"].forEach(v=>{
    document.getElementById(v+"View").classList.toggle("hidden", v!==which);
    document.getElementById("tab"+v[0].toUpperCase()+v.slice(1)).classList.toggle("active", v===which);
  });
  document.getElementById("mainControls").classList.toggle("hidden", !(which==="bundle"||which==="season"));
  if (which==="cart") renderCart();
  if (which==="today") renderToday();
}

/* ---------- Settings toggles ---------- */
function applyDark(){ document.body.classList.toggle("dark", settings.dark);
  const b=document.getElementById("btnDark"); b.classList.toggle("on", settings.dark);
  b.textContent = settings.dark ? "☀️ Light" : "🌙 Dark"; }
function applySoundBtn(){ const b=document.getElementById("btnSound"); b.classList.toggle("on", settings.sound);
  b.textContent = settings.sound ? "🔔 Sound" : "🔕 Sound"; }
function applyPetalsBtn(){ const b=document.getElementById("btnPetals"); b.classList.toggle("on", settings.petals);
  b.textContent = settings.petals ? "🌸 Petals" : "🚫 Petals"; if (settings.petals) startPetals(); }

/* ---------- Sounds (Web Audio, no files) ---------- */
let audioCtx = null;
function ensureAudio(){ if(!audioCtx){ try{ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch{} } }
function beep(freq,dur,type="triangle",vol=0.1,when=0){
  if(!audioCtx) return;
  const o=audioCtx.createOscillator(), g=audioCtx.createGain();
  o.type=type; o.frequency.value=freq; o.connect(g); g.connect(audioCtx.destination);
  const t=audioCtx.currentTime+when;
  g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.start(t); o.stop(t+dur);
}
function playPop(){ ensureAudio(); beep(680,0.12,"triangle",0.11); beep(920,0.09,"sine",0.06,0.02); }
function playFanfare(){ ensureAudio(); [523,659,784,1047].forEach((f,i)=> beep(f,0.2,"triangle",0.11,i*0.1)); }

/* ---------- Confetti ---------- */
const cvs = document.getElementById("confetti"), ctx = cvs.getContext("2d");
let parts = [], raf = null;
function sizeConfetti(){ cvs.width=innerWidth; cvs.height=innerHeight; }
const CONFETTI_COLORS = ["#ff9ec4","#b89bff","#7fd8b6","#ffd97a","#ffb3c6","#a0e7ff"];
function fireConfetti(){
  for (let i=0;i<110;i++) parts.push({
    x:innerWidth/2+(Math.random()-.5)*240, y:innerHeight*0.32,
    vx:(Math.random()-.5)*9, vy:Math.random()*-9-4, g:0.22+Math.random()*0.12,
    size:6+Math.random()*7, color:CONFETTI_COLORS[i%CONFETTI_COLORS.length],
    rot:Math.random()*6.28, vr:(Math.random()-.5)*0.45, life:0 });
  if (!raf) raf = requestAnimationFrame(tickConfetti);
}
function tickConfetti(){
  ctx.clearRect(0,0,cvs.width,cvs.height);
  parts = parts.filter(p=>p.y<cvs.height+30 && p.life<280);
  parts.forEach(p=>{ p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.life++;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle=p.color;
    ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.62); ctx.restore(); });
  if (parts.length) raf = requestAnimationFrame(tickConfetti);
  else { raf=null; ctx.clearRect(0,0,cvs.width,cvs.height); }
}

/* ---------- Petals background ---------- */
const petalCvs = document.getElementById("petals"), pctx = petalCvs.getContext("2d");
let petals = [], petalRaf = null;
const PETAL_STYLES = { Spring:{ch:"🌸",n:18}, Summer:{ch:"🌼",n:16}, Fall:{ch:"🍂",n:18}, Winter:{ch:"❄️",n:22}, "":{ch:"🌸",n:16} };
function sizePetals(){ petalCvs.width=innerWidth; petalCvs.height=innerHeight; }
function newPetal(ch, anywhere){
  return { ch, x:Math.random()*innerWidth, y:anywhere?Math.random()*innerHeight:-24,
    vy:0.4+Math.random()*0.9, vx:(Math.random()-.5)*0.5, size:14+Math.random()*12,
    rot:Math.random()*6.28, vr:(Math.random()-.5)*0.02, sway:Math.random()*6.28 };
}
function initPetals(){ const st=PETAL_STYLES[currentSeason]||PETAL_STYLES[""]; petals=[]; for(let i=0;i<st.n;i++) petals.push(newPetal(st.ch,true)); }
function tickPetals(){
  if (!settings.petals){ pctx.clearRect(0,0,petalCvs.width,petalCvs.height); petalRaf=null; return; }
  pctx.clearRect(0,0,petalCvs.width,petalCvs.height);
  pctx.globalAlpha = 0.5;
  const st = PETAL_STYLES[currentSeason]||PETAL_STYLES[""];
  petals.forEach(p=>{
    p.sway+=0.02; p.y+=p.vy; p.x+=p.vx+Math.sin(p.sway)*0.4; p.rot+=p.vr;
    if (p.y>innerHeight+24) Object.assign(p, newPetal(st.ch,false));
    pctx.save(); pctx.translate(p.x,p.y); pctx.rotate(p.rot);
    pctx.font = p.size+"px serif"; pctx.fillText(p.ch,0,0); pctx.restore();
  });
  pctx.globalAlpha = 1;
  petalRaf = requestAnimationFrame(tickPetals);
}
function startPetals(){ sizePetals(); if(!petals.length) initPetals(); if(settings.petals && !petalRaf) petalRaf=requestAnimationFrame(tickPetals); }
function refreshPetalSeason(){ const st=PETAL_STYLES[currentSeason]||PETAL_STYLES[""]; petals.forEach(p=>p.ch=st.ch); }

addEventListener("resize", ()=>{ sizeConfetti(); sizePetals(); });
sizeConfetti(); sizePetals();

/* ---------- Backup / restore / reset ---------- */
function exportData(){
  const payload = { checked, gold };
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = "stardew-bundle-progress.json"; a.click();
}
function importData(){
  const inp = document.createElement("input"); inp.type="file"; inp.accept="application/json";
  inp.onchange = ()=>{ const f=inp.files[0]; if(!f) return; const r=new FileReader();
    r.onload = ()=>{ try{
        const d = JSON.parse(r.result);
        if (d && d.checked){ checked = d.checked||{}; gold = d.gold||0; }
        else { checked = d||{}; }                // back-compat with old format
        save(); saveGold(); rerender(); alert("Progress loaded! 🐰");
      } catch { alert("Hmm, that file didn't look right."); } };
    r.readAsText(f); };
  inp.click();
}
function resetAll(){
  if (confirm("Clear ALL checkmarks & gold? This can't be undone (export a backup first if unsure).")){
    checked = {}; gold = 0; save(); saveGold(); rerender();
  }
}

function rerender(){
  suppressConfetti = true;
  renderBundles(); renderSeasons();
  refreshProgress(); applyView();
  if (activeView==="cart") renderCart();
  if (activeView==="today") renderToday();
}

/* ---------- Init ---------- */
load();
applyDark(); applySoundBtn(); applyPetalsBtn();
rerender();
startPetals();

document.getElementById("tabBundle").onclick = ()=>switchView("bundle");
document.getElementById("tabSeason").onclick = ()=>switchView("season");
document.getElementById("tabCart").onclick   = ()=>switchView("cart");
document.getElementById("tabToday").onclick  = ()=>switchView("today");

document.getElementById("btnExport").onclick = exportData;
document.getElementById("btnImport").onclick = importData;
document.getElementById("btnReset").onclick  = resetAll;
document.getElementById("btnHideDone").onclick = (e)=>{
  hideDone = !hideDone;
  e.target.classList.toggle("on", hideDone);
  e.target.textContent = hideDone ? "🙈 Hiding done" : "👀 Hide done";
  applyView();
};
document.getElementById("btnDark").onclick = ()=>{ settings.dark=!settings.dark; saveSettings(); applyDark(); };
document.getElementById("btnSound").onclick = ()=>{ settings.sound=!settings.sound; saveSettings(); applySoundBtn(); if(settings.sound){ ensureAudio(); playPop(); } };
document.getElementById("btnPetals").onclick = ()=>{ settings.petals=!settings.petals; saveSettings(); applyPetalsBtn(); if(!settings.petals && petalRaf){ cancelAnimationFrame(petalRaf); petalRaf=null; pctx.clearRect(0,0,petalCvs.width,petalCvs.height); } };

document.querySelectorAll(".chip.filter").forEach(btn=> btn.onclick = ()=>{
  filterMode = btn.dataset.filter;
  document.querySelectorAll(".chip.filter").forEach(b=>b.classList.toggle("active", b===btn));
  applyView();
});
document.querySelectorAll(".chip.season").forEach(btn=> btn.onclick = ()=>{
  currentSeason = btn.dataset.season;
  document.querySelectorAll(".chip.season").forEach(b=>b.classList.toggle("active", b===btn));
  refreshPetalSeason(); applyView();
});

const searchEl = document.getElementById("search"), searchClear = document.getElementById("searchClear");
searchEl.addEventListener("input", ()=>{
  searchTerm = searchEl.value.trim().toLowerCase();
  searchClear.classList.toggle("show", searchTerm.length>0);
  applyView();
  if (activeView==="cart") renderCart();
  if (activeView==="today") renderToday();
});
searchClear.onclick = ()=>{ searchEl.value=""; searchTerm=""; searchClear.classList.remove("show");
  applyView(); if(activeView==="cart")renderCart(); if(activeView==="today")renderToday(); };
