// IndexedDB storage for topper handwritten copy page images
// Keeps images persistent across page refreshes without bloating localStorage

const DB_NAME  = "upsc_toppers";
const DB_VER   = 1;
const STORE    = "pages";
const META_KEY = "upsc_topper_copies";

// ── IndexedDB ────────────────────────────────────────────────────────────────

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE))
        db.createObjectStore(STORE, { keyPath: "key" });
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

async function idbPut(key, dataUrl) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  const st = tx.objectStore(STORE);
  return new Promise((res, rej) => {
    const r = st.put({ key, dataUrl });
    r.onsuccess = () => res(); r.onerror = () => rej(r.error);
  });
}

async function idbGet(key) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  const st = tx.objectStore(STORE);
  return new Promise((res, rej) => {
    const r = st.get(key);
    r.onsuccess = () => res(r.result?.dataUrl || null); r.onerror = () => rej(r.error);
  });
}

async function idbDeletePrefix(prefix) {
  const db  = await openDB();
  const tx  = db.transaction(STORE, "readwrite");
  const st  = tx.objectStore(STORE);
  const all = await new Promise((res, rej) => {
    const r = st.getAllKeys();
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  for (const k of all) {
    if (String(k).startsWith(prefix)) st.delete(k);
  }
}

// ── Public helpers ────────────────────────────────────────────────────────────

export async function storePage(copyId, pageNum, dataUrl) {
  await idbPut(`${copyId}_p${pageNum}`, dataUrl);
}

export async function loadPage(copyId, pageNum) {
  return idbGet(`${copyId}_p${pageNum}`);
}

export async function deleteCopyImages(copyId) {
  try { await idbDeletePrefix(copyId); } catch {}
}

export async function deletePageImage(copyId, pageNum) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(`${copyId}_p${pageNum}`);
  } catch {}
}

// ── Diagram Bank ─────────────────────────────────────────────────────────────

const DIAG_META_KEY = "upsc_diag_bank";

export async function saveBankDiagramImage(id, dataUrl) {
  await idbPut(`dbank_${id}`, dataUrl);
}

export async function loadBankDiagramImage(id) {
  return idbGet(`dbank_${id}`);
}

export async function deleteBankDiagramImage(id) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(`dbank_${id}`);
  } catch {}
}

export function loadDiagramBankMeta() {
  try { return JSON.parse(localStorage.getItem(DIAG_META_KEY) || "[]"); } catch { return []; }
}

export function saveDiagramBankMeta(entries) {
  try { localStorage.setItem(DIAG_META_KEY, JSON.stringify(entries)); } catch {}
}

// ── Metadata (name, text, status) in localStorage ────────────────────────────

export function loadCopiesMeta() {
  try {
    const s = localStorage.getItem(META_KEY);
    return s ? JSON.parse(s) : [];
  } catch { return []; }
}

export function saveCopiesMeta(copies) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(
      copies.map(c => ({
        ...c,
        pages: c.pages.map(p => ({ ...p, dataUrl: null })), // never store images in LS
      }))
    ));
  } catch {}
}
