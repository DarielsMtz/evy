/* ── PHOTO DATA CATEGORIZADA ────────────────────────────── */
let PHOTOS = [
    { id: '1506905925346-21bda4d32df4', aspect: 'portrait', album: 'Naturaleza', title: 'Cima en calma', desc: 'El amanecer disuelve la noche en capas de luz difusa. Tomada al filo de las 6:12 h.' },
    { id: '1519681393784-d120267933ba', aspect: 'portrait', album: 'Naturaleza', title: 'Firmamento abierto', desc: 'La Vía Láctea sobre los Alpes. A 2 800 metros de altitud, la ausencia de contaminación lumínica convierte el cielo en un mapa vivo.' },
    { id: '1441974231531-c6227db76b6e', aspect: 'portrait', album: 'Naturaleza', title: 'Túnel de luz', desc: 'Un sendero en el Parque Nacional de los Redwoods. La luz filtrada entre los troncos no ilumina: susurra.' },
    { id: '1470071459604-3b5ec3a7fe05', aspect: 'landscape', album: 'Viajes', title: 'Oro tardío', desc: 'La última hora de luz sobre las colinas toscanas. Cada verano, los mismos campos vuelven a pintarse de dorado.' },
    { id: '1477959858617-67f85cf4f1df', aspect: 'landscape', album: 'Urbano', title: 'Ciudad en vela', desc: 'Manhattan a las 3 de la madrugada. Cuando todos duermen, la ciudad no apaga las luces: las baja de volumen.' },
    { id: '1501854140801-50d01698950b', aspect: 'portrait', album: 'Naturaleza', title: 'Niebla viva', desc: 'Amanecer en los Cárpatos. La niebla asciende entre los pinos como una marea lenta.' },
    { id: '1518173946687-a4c8892bbd9f', aspect: 'portrait', album: 'Urbano', title: 'Geometría vertical', desc: 'Los rascacielos de Chicago desde el río. La arquitectura como ambición congelada en acero y cristal.' },
    { id: '1493246507139-91e8fad9978e', aspect: 'landscape', album: 'Viajes', title: 'Reflejo exacto', desc: 'El lago Moraine en Alberta, Canadá. La superficie guarda una copia perfecta del mundo hasta que el viento decide romperla.' },
    { id: '1504701954957-2010ec3bcec1', aspect: 'landscape', album: 'Viajes', title: 'Desierto vivo', desc: 'Las dunas del Sahara al atardecer. El desierto no está vacío: está lleno de silencio.' },
    { id: '1535591273668-578e31182c4f', aspect: 'portrait', album: 'Naturaleza', title: 'Cascada muda', desc: 'Skógafoss, Islandia, en invierno. A -12 °C, el agua sigue cayendo.' },
    { id: '1510797215324-95aa89f43c33', aspect: 'landscape', album: 'Naturaleza', title: 'Costa quebrada', desc: 'Los acantilados de Moher bajo tormenta. El mar no convence: impone.' },
    { id: '1525193612562-aa34e4f3e8f7', aspect: 'landscape', album: 'Cultura', title: 'Lluvia de color', desc: 'Festival Holi en Jodhpur. Durante unos minutos, el color lo borra todo: las diferencias, los nombres.' },
];

/* ── CARGAR DATOS DESDE EL PANEL DE CONTROL ───────────────────── */
try {
    const savedData = localStorage.getItem('nuestra_historia_datos');
    if (savedData) {
        const { photos, texts } = JSON.parse(savedData);

        // Sobrescribir fotos si hay fotos guardadas
        if (photos && photos.length > 0) {
            PHOTOS = photos;
        }

        // Sobrescribir los textos del DOM (se usa un pequeño retardo para asegurar carga del DOM)
        if (texts) {
            window.addEventListener('DOMContentLoaded', () => {
                const setEl = (sel, html) => { const e = document.querySelector(sel); if (e) e.innerHTML = html; };
                setEl('.hero-eyebrow', texts.eyebrow);
                setEl('.hero-title', texts.title);
                setEl('.hero-sub', texts.sub);
                setEl('.hero-cta', texts.cta);
                setEl('#gmEyebrow', texts.gmEyebrow);
                setEl('#gmTitle', texts.gmTitle);
            });
        }
    }
} catch (e) { console.error("Error al cargar los datos del panel", e); }

/* ── HELPERS ─────────────────────────────────────────────────── */
const mobile = () => window.innerWidth < 600;
const tablet = () => window.innerWidth < 900;
const cx = () => window.innerWidth / 2;
const cy = () => window.innerHeight / 2;
const maxR = () => Math.max(window.innerWidth, window.innerHeight) * (mobile() ? .52 : .65);

function photoSize(aspect) {
    const s = mobile() ? .52 : tablet() ? .7 : 1;
    const v = .75 + Math.random() * .45;
    return aspect === 'portrait'
        ? { w: Math.round(170 * s * v), h: Math.round(240 * s * v) }
        : { w: Math.round(240 * s * v), h: Math.round(168 * s * v) };
}

function unsplash(id, w, h) {
    // Verificamos si es una URL en base64 de una foto subida localmente
    if (id && id.startsWith('data:image')) return id;
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
}

/* ── CURSOR (desktop) ────────────────────────────────────────── */
const cursorEl = document.getElementById('cursor');
if (cursorEl && matchMedia('(hover:hover)').matches) {
    document.addEventListener('mousemove', e => {
        cursorEl.style.cssText = `left:${e.clientX}px;top:${e.clientY}px`;
    });
}
function withHover(el) {
    if (!cursorEl) return;
    el.addEventListener('mouseenter', () => cursorEl.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorEl.classList.remove('hover'));
}

/* ── SPAWN LOOP ──────────────────────────────────────────────── */
const stage = document.getElementById('stage');
let idx = 0;
const INTERVAL = mobile() ? 1100 : 850;
const TRAVEL = mobile() ? 4000 : 4800;

function spawn() {
    const data = PHOTOS[idx++ % PHOTOS.length];
    const { w, h } = photoSize(data.aspect);
    const angle = Math.random() * Math.PI * 2;
    const r0 = initRot(), r1 = r0 + (Math.random() - .5) * 14;

    function initRot() { return (Math.random() - .5) * 9; }

    const card = document.createElement('div');
    card.className = 'photo-card';
    Object.assign(card.style, {
        width: w + 'px', height: h + 'px',
        left: cx() - w / 2 + 'px', top: cy() - h / 2 + 'px',
        transform: `rotate(${r0}deg)`
    });

    const img = document.createElement('img');
    img.src = unsplash(data.id, w * 2, h * 2);
    img.alt = data.title;
    img.loading = 'lazy';
    img.draggable = false;

    const hint = document.createElement('div');
    hint.className = 'tap-hint';
    hint.innerHTML = '<span>Ver detalle</span>';

    card.append(img, hint);
    stage.appendChild(card);

    card.addEventListener('click', () => openLb(data));
    withHover(card);

    const dist = maxR() * (.45 + Math.random() * .55);
    const sx = cx() - w / 2, sy = cy() - h / 2;
    const dx = cx() + Math.cos(angle) * dist - w / 2;
    const dy = cy() + Math.sin(angle) * dist - h / 2;
    const t0 = performance.now();

    (function tick(now) {
        const p = Math.min((now - t0) / TRAVEL, 1);
        const e = 1 - Math.pow(1 - p, 3);

        card.style.left = sx + (dx - sx) * e + 'px';
        card.style.top = sy + (dy - sy) * e + 'px';
        card.style.transform = `rotate(${r0 + (r1 - r0) * e}deg)`;

        const fi = .2, ho = .65;
        card.style.opacity = p < fi ? p / fi : p < ho ? 1 : Math.max(0, 1 - (p - ho) / (1 - ho));

        p < 1 ? requestAnimationFrame(tick) : card.remove();
    })(t0);
}

const burst = mobile() ? 3 : 5;
for (let i = 0; i < burst; i++) setTimeout(spawn, i * 200);
setInterval(spawn, INTERVAL);


/* ── MODAL DE NAVEGACIÓN Y CARPETAS ──────────────────────────── */
const gm = document.getElementById('grid-modal');
const gmGrid = document.getElementById('gmGrid');
const gmClose = document.getElementById('gmClose');
const gmBack = document.getElementById('gmBack');
const gmEyebrow = document.getElementById('gmEyebrow');
const gmTitle = document.getElementById('gmTitle');
const gmCount = document.getElementById('gmCount');

// Extraer categorías únicas
const albumsList = [...new Set(PHOTOS.map(p => p.album))];
let currentViewContext = null;

// Vista 1: Carpetas
function buildAlbums() {
    currentViewContext = 'albums';
    gmBack.style.display = 'none';
    gmEyebrow.textContent = 'Explora por categoría';
    gmTitle.textContent = 'Colecciones';
    gmCount.textContent = `${albumsList.length} álbumes`;
    gmGrid.className = 'folder-grid';
    gmGrid.innerHTML = '';

    albumsList.forEach((albumName, i) => {
        const albumPhotos = PHOTOS.filter(p => p.album === albumName);
        const coverPhoto = albumPhotos[0];

        const folder = document.createElement('div');
        folder.className = 'folder-card';

        // Estructura de la carpeta CSS
        folder.innerHTML = `
      <div class="folder-back"></div>
      <div class="folder-paper">
        <img src="${unsplash(coverPhoto.id, 400, 300)}" alt="Portada de ${albumName}">
      </div>
      <div class="folder-front">
        <h3 class="folder-title">${albumName}</h3>
        <span class="folder-count">${albumPhotos.length} fotografías</span>
      </div>
    `;

        folder.addEventListener('click', () => buildPhotos(albumName));
        withHover(folder);
        gmGrid.appendChild(folder);

        setTimeout(() => folder.classList.add('visible'), i * 60);
    });
}

// Vista 2: Fotos dentro de una carpeta
function buildPhotos(albumName) {
    currentViewContext = albumName;
    gmBack.style.display = 'inline-flex';
    gmEyebrow.textContent = 'Álbum';
    gmTitle.textContent = albumName;

    const albumPhotos = PHOTOS.filter(p => p.album === albumName);
    gmCount.textContent = `${albumPhotos.length} imágenes`;

    gmGrid.className = 'photo-grid';
    gmGrid.innerHTML = '';

    albumPhotos.forEach((data, i) => {
        const item = document.createElement('div');
        item.className = 'gm-item';

        const img = document.createElement('img');
        img.src = unsplash(data.id, 400, 560);
        img.alt = data.title;
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'gm-item-overlay';
        overlay.innerHTML = `<p class="gm-item-title">${data.title}</p><span class="gm-item-cue">Ver detalle</span>`;

        item.append(img, overlay);

        // Al hacer click abrimos el Lightbox
        item.addEventListener('click', () => {
            // Opcional: no cerrar el grid, solo poner el lightbox por encima
            openLb(data, albumPhotos);
        });

        withHover(item);
        gmGrid.appendChild(item);

        setTimeout(() => item.classList.add('visible'), i * 55);
    });
}

function openGm() {
    buildAlbums();
    gm.classList.add('open');
}
function closeGm() { gm.classList.remove('open'); }

gmBack.addEventListener('click', buildAlbums);
gmClose.addEventListener('click', closeGm);
withHover(gmClose);
withHover(gmBack);

/* ── LIGHTBOX ────────────────────────────────────────────────── */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbTitle = document.getElementById('lbTitle');
const lbDesc = document.getElementById('lbDesc');
const lbNum = document.getElementById('lbNum');
const lbAlbumTag = document.getElementById('lbAlbumTag');
const lbClose = document.getElementById('lbClose');

// Se pasa el contexto de las fotos (si viene de un álbum o general)
function openLb(data, contextPhotos = PHOTOS) {
    const n = contextPhotos.indexOf(data) + 1;
    const lw = mobile() ? 800 : 1400;
    const lh = mobile() ? 600 : 1800;

    lbImg.src = unsplash(data.id, lw, lh);
    lbImg.alt = data.title;
    lbTitle.textContent = data.title;
    lbDesc.textContent = data.desc;
    lbAlbumTag.textContent = data.album;
    lbNum.textContent = `${String(n).padStart(2, '0')} / ${String(contextPhotos.length).padStart(2, '0')}`;

    lb.classList.add('open');
}

function closeLb() { lb.classList.remove('open'); }

lbClose.addEventListener('click', closeLb);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
withHover(lbClose);

// Teclado
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (lb.classList.contains('open')) {
            closeLb();
        } else if (gm.classList.contains('open')) {
            if (currentViewContext !== 'albums') buildAlbums();
            else closeGm();
        }
    }
});

/* ── CTA HERO ────────────────────────────────────────────────── */
const cta = document.getElementById('ctaBtn');
cta.addEventListener('click', openGm);
withHover(cta);