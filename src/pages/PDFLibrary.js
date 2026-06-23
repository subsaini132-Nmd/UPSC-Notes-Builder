import React, { useState, useRef, useEffect, useCallback } from "react";
import { SAMPLE_PDFS } from "../lib/constants";
import { extractAndStore, isDocExtracted, deleteDocContent, getTopicSuggestions } from "../lib/pdfExtract";
import {
  loadSyllabus, loadDocTopicMaps, saveDocTopicMaps, mapTopicsToSyllabus,
} from "../lib/syllabusData";

const ACCEPTED_TYPES = {
  "application/pdf": { ext: "PDF", icon: "📄" },
  "application/msword": { ext: "DOC", icon: "📝" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { ext: "DOCX", icon: "📝" },
};
const ACCEPT_ATTR = ".pdf,.doc,.docx";

function isAccepted(file) {
  return !!ACCEPTED_TYPES[file.type] || /\.(pdf|doc|docx)$/i.test(file.name);
}

function fileTypeMeta(file) {
  return ACCEPTED_TYPES[file.type] ||
    (/\.docx?$/i.test(file.name) ? { ext: "DOCX", icon: "📝" } : { ext: "PDF", icon: "📄" });
}

function estimatePages(sizeStr, ext) {
  const mb = parseFloat(sizeStr) || 1;
  return ext === "DOC" || ext === "DOCX"
    ? Math.round(mb * 25 + Math.random() * 10)
    : Math.round(mb * 13 + Math.random() * 15);
}

function estimateChunks(pages) {
  return Math.round(pages * 6 + Math.random() * 40);
}

const STORAGE_KEY = "upsc_library_docs";

function loadDocs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved).map(d =>
        d.status === "processing" ? { ...d, status: "queued" } : d
      );
    }
  } catch {}
  return SAMPLE_PDFS;
}

function saveDocs(docs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(docs)); } catch {}
}

// ── Syllabus mapping helpers ──────────────────────────────────────────────────

async function buildDocMapping(docId) {
  const syllabus = loadSyllabus();
  const topics   = await getTopicSuggestions([docId]);
  if (!topics.length) return [];
  return mapTopicsToSyllabus(topics, syllabus);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PDFLibrary({ onNavigate }) {
  const [docs,          setDocs]          = useState(loadDocs);
  const [extractedIds,  setExtractedIds]  = useState(new Set());
  const [dragging,      setDragging]      = useState(false);
  const [reIndexDocId,  setReIndexDocId]  = useState(null);
  const [docMaps,       setDocMaps]       = useState(loadDocTopicMaps);
  const [expandedDocId, setExpandedDocId] = useState(null);
  const [mappingDocId,  setMappingDocId]  = useState(null); // currently running mapping

  const fileRef       = useRef();
  const reIndexRef    = useRef();
  const processingRef = useRef(new Set());
  const docsRef       = useRef(docs);

  useEffect(() => { docsRef.current = docs; }, [docs]);
  useEffect(() => { saveDocs(docs); }, [docs]);

  // On mount: resolve queued docs + discover already-extracted docs
  useEffect(() => {
    docs.forEach(doc => {
      if (doc.status === "queued" && !processingRef.current.has(doc.id)) {
        processingRef.current.add(doc.id);
        fakeProcessById(doc.id);
      }
    });

    const indexed = docs.filter(d => d.status === "indexed");
    if (indexed.length > 0) {
      Promise.all(indexed.map(async d => ({ id: d.id, ok: await isDocExtracted(d.id) })))
        .then(results => setExtractedIds(new Set(results.filter(r => r.ok).map(r => r.id))));
    }
  // eslint-disable-next-line
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────────

  const fakeProcessById = useCallback((docId) => {
    const t1 = setTimeout(() => {
      setDocs(prev => prev.map(d => {
        if (d.id !== docId) return d;
        const pages = typeof d.pages === "number" ? d.pages : estimatePages(d.size, d.ext);
        return { ...d, status: "processing", pages };
      }));
      const t2 = setTimeout(() => {
        setDocs(prev => prev.map(d => {
          if (d.id !== docId) return d;
          const pages  = typeof d.pages === "number" ? d.pages : estimatePages(d.size, d.ext);
          const chunks = estimateChunks(pages);
          return { ...d, status: "indexed", pages, chunks };
        }));
      }, 4500);
      return () => clearTimeout(t2);
    }, 1800);
    return () => clearTimeout(t1);
  }, []);

  // Run syllabus mapping for a doc and persist result
  const runMapping = useCallback(async (docId) => {
    setMappingDocId(docId);
    try {
      const mappings = await buildDocMapping(docId);
      setDocMaps(prev => {
        const updated = { ...prev, [docId]: { mappings, deleted: prev[docId]?.deleted || [] } };
        saveDocTopicMaps(updated);
        return updated;
      });
    } finally {
      setMappingDocId(null);
    }
  }, []);

  const runExtraction = useCallback(async (docId, file) => {
    processingRef.current.add(docId);
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: "processing", progress: 0 } : d));

    try {
      const result = await extractAndStore(docId, file, (page, total) => {
        setDocs(prev => prev.map(d =>
          d.id === docId ? { ...d, progress: Math.round((page / total) * 100) } : d
        ));
      });

      const updated = docsRef.current.map(d =>
        d.id === docId
          ? { ...d, status: "indexed", pages: result.pages, chunks: result.chunks, progress: undefined }
          : d
      );
      saveDocs(updated);
      setDocs(updated);
      setExtractedIds(prev => new Set([...prev, docId]));

      // Auto-run syllabus mapping after extraction
      runMapping(docId);
    } catch (err) {
      console.warn("PDF extraction failed:", err);
      const pages  = estimatePages(file ? (file.size / 1024 / 1024).toFixed(1) : "1", "PDF");
      const chunks = estimateChunks(pages);
      const updated = docsRef.current.map(d =>
        d.id === docId
          ? { ...d, status: "indexed", pages, chunks, progress: undefined }
          : d
      );
      saveDocs(updated);
      setDocs(updated);
    }
  }, [runMapping]);

  // ── File add ──────────────────────────────────────────────────────────────────

  const addFiles = useCallback((files) => {
    const valid = files.filter(isAccepted);
    if (!valid.length) return;

    const newDocs = valid.map((f, i) => {
      const { ext, icon } = fileTypeMeta(f);
      return {
        id: String(Date.now() + i), name: f.name, ext, icon,
        size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
        pages: "—", chunks: 0, status: "queued",
        date: new Date().toISOString().slice(0, 10),
      };
    });

    setDocs(prev => [...newDocs, ...prev]);
    newDocs.forEach((doc, i) => {
      processingRef.current.add(doc.id);
      if (doc.ext === "PDF") runExtraction(doc.id, valid[i]);
      else fakeProcessById(doc.id);
    });
  }, [runExtraction, fakeProcessById]);

  // ── Re-index flow ─────────────────────────────────────────────────────────────

  const handleReIndexClick = (docId) => {
    setReIndexDocId(docId);
    reIndexRef.current.value = "";
    reIndexRef.current.click();
  };

  const handleReIndexFile = (e) => {
    const file  = e.target.files[0];
    const docId = reIndexDocId;
    setReIndexDocId(null);
    if (!file || !docId) return;
    runExtraction(docId, file);
  };

  // ── Remove ────────────────────────────────────────────────────────────────────

  const removeDoc = (docId) => {
    setDocs(prev => prev.filter(d => d.id !== docId));
    setExtractedIds(prev => { const s = new Set(prev); s.delete(docId); return s; });
    deleteDocContent(docId);
    setDocMaps(prev => {
      const next = { ...prev };
      delete next[docId];
      saveDocTopicMaps(next);
      return next;
    });
    if (expandedDocId === docId) setExpandedDocId(null);
  };

  // ── Mapping: delete one mapping entry ────────────────────────────────────────

  const deleteMapping = useCallback((docId, docTopic) => {
    setDocMaps(prev => {
      const entry    = prev[docId] || { mappings: [], deleted: [] };
      const deleted  = [...new Set([...entry.deleted, docTopic])];
      const updated  = {
        ...prev,
        [docId]: { ...entry, deleted },
      };
      saveDocTopicMaps(updated);
      return updated;
    });
  }, []);

  // ── Expand toggle ─────────────────────────────────────────────────────────────

  const toggleMapping = async (docId) => {
    if (expandedDocId === docId) { setExpandedDocId(null); return; }
    setExpandedDocId(docId);
    // Run mapping if not yet done
    if (!docMaps[docId] && !mappingDocId) {
      await runMapping(docId);
    }
  };

  // ── Drag / drop ───────────────────────────────────────────────────────────────

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  // ── Stats ─────────────────────────────────────────────────────────────────────

  const totalIndexed    = docs.filter(d => d.status === "indexed").length;
  const totalChunks     = docs.filter(d => d.status === "indexed").reduce((s, d) => s + (d.chunks || 0), 0);
  const totalSearchable = extractedIds.size;
  const totalMapped     = Object.keys(docMaps).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">PDF Library</p>
          <h1 className="page-title">Source Documents</h1>
        </div>
        <div className="lib-upload-btns">
          <button className="secondary-btn" onClick={() => onNavigate && onNavigate("syllabusmap")}>
            📋 Manage Syllabus
          </button>
          <button className="primary-btn" onClick={() => fileRef.current.click()}>
            + Upload Document
          </button>
          <span className="lib-accept-hint">PDF · DOC · DOCX</span>
        </div>
        <input ref={fileRef} type="file" accept={ACCEPT_ATTR} multiple style={{ display: "none" }}
          onChange={e => addFiles(Array.from(e.target.files))} />
        <input ref={reIndexRef} type="file" accept=".pdf" style={{ display: "none" }}
          onChange={handleReIndexFile} />
      </div>

      {/* Stats */}
      <div className="library-stats">
        <div className="lib-stat"><span className="lib-stat-val">{docs.length}</span><span className="lib-stat-label">Total Docs</span></div>
        <div className="lib-stat-div" />
        <div className="lib-stat"><span className="lib-stat-val">{totalIndexed}</span><span className="lib-stat-label">Indexed</span></div>
        <div className="lib-stat-div" />
        <div className="lib-stat"><span className="lib-stat-val">{totalChunks.toLocaleString()}</span><span className="lib-stat-label">Chunks Ready</span></div>
        <div className="lib-stat-div" />
        <div className="lib-stat">
          <span className="lib-stat-val" style={{ color: totalSearchable > 0 ? "#22c55e" : undefined }}>
            {totalSearchable}
          </span>
          <span className="lib-stat-label">AI-Searchable</span>
        </div>
        <div className="lib-stat-div" />
        <div className="lib-stat">
          <span className="lib-stat-val" style={{ color: totalMapped > 0 ? "#0369A1" : undefined }}>
            {totalMapped}
          </span>
          <span className="lib-stat-label">Syllabus Mapped</span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className={`drop-zone ${dragging ? "dragging" : ""}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
      >
        <div className="drop-icon">📂</div>
        <div className="drop-text-group">
          <div className="drop-title">Drag & drop PDFs or Word files here</div>
          <div className="drop-sub">PDFs are fully text-extracted, AI-searchable, and auto-mapped to UPSC syllabus topics</div>
        </div>
        <div className="drop-btn-label">+ Click to browse</div>
      </div>

      {/* Document Table */}
      <div className="pdf-table-wrap">
        <table className="pdf-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Type</th>
              <th>Pages</th>
              <th>Size</th>
              <th>Chunks</th>
              <th>Status</th>
              <th>Syllabus</th>
              <th>Uploaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {docs.map(doc => {
              const isSearchable = extractedIds.has(doc.id);
              const isIndexed    = doc.status === "indexed";
              const inProgress   = doc.status === "processing";
              const progress     = doc.progress;
              const docMap       = docMaps[doc.id];
              const visibleMappings = docMap
                ? docMap.mappings.filter(m => !docMap.deleted.includes(m.docTopic))
                : null;
              const isExpanded   = expandedDocId === doc.id;
              const isMappingNow = mappingDocId === doc.id;

              return (
                <React.Fragment key={doc.id}>
                  <tr className={isExpanded ? "pdf-row-expanded" : ""}>
                    <td>
                      <div className="pdf-table-name">
                        <span className="pdf-table-icon">{doc.icon || "📄"}</span>
                        <span>{doc.name}</span>
                      </div>
                    </td>
                    <td className="pdf-table-meta">
                      <span className={`lib-type-badge ${(doc.ext || "PDF").toLowerCase()}`}>
                        {doc.ext || "PDF"}
                      </span>
                    </td>
                    <td className="pdf-table-meta">{doc.pages}</td>
                    <td className="pdf-table-meta">{doc.size}</td>
                    <td className="pdf-table-meta">
                      {isIndexed ? doc.chunks.toLocaleString() : "—"}
                    </td>
                    <td>
                      <div className="pdf-status-cell">
                        <span className={`pdf-status-badge ${doc.status}`}>
                          {isIndexed && isSearchable && "✓ Searchable"}
                          {isIndexed && !isSearchable && "✓ Indexed"}
                          {inProgress && (progress != null ? `⚙ ${progress}%` : "⚙ Processing…")}
                          {doc.status === "queued" && "⏳ Queued"}
                        </span>
                        {inProgress && progress != null && (
                          <div className="pdf-progress-bar">
                            <div className="pdf-progress-fill" style={{ width: `${progress}%` }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {isIndexed && isSearchable && (
                        <button
                          className={`syl-map-btn ${isExpanded ? "active" : ""} ${isMappingNow ? "loading" : ""}`}
                          onClick={() => toggleMapping(doc.id)}
                          title="View/refresh syllabus topic mapping"
                        >
                          {isMappingNow
                            ? "⟳ Mapping…"
                            : visibleMappings
                              ? `📚 ${visibleMappings.length} topics`
                              : "📚 Map Topics"
                          }
                        </button>
                      )}
                    </td>
                    <td className="pdf-table-meta">{doc.date}</td>
                    <td>
                      <div className="pdf-action-cell">
                        {isIndexed && !isSearchable && doc.ext === "PDF" && (
                          <button className="lib-enable-search-btn" onClick={() => handleReIndexClick(doc.id)}>
                            Enable Search
                          </button>
                        )}
                        <button className="pdf-action-btn" onClick={() => removeDoc(doc.id)}>Remove</button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded syllabus mapping panel */}
                  {isExpanded && (
                    <tr className="mapping-panel-row">
                      <td colSpan={9}>
                        <div className="mapping-panel">
                          <div className="mapping-panel-header">
                            <div className="mapping-panel-title">
                              📚 Syllabus Mapping — <em>{doc.name}</em>
                            </div>
                            <div className="mapping-panel-actions">
                              <button
                                className="mapping-refresh-btn"
                                onClick={() => runMapping(doc.id)}
                                disabled={isMappingNow}
                              >
                                {isMappingNow ? "⟳ Re-mapping…" : "⟳ Re-map"}
                              </button>
                              <button
                                className="mapping-manage-btn"
                                onClick={() => onNavigate && onNavigate("syllabusmap")}
                              >
                                Edit Syllabus
                              </button>
                              <button className="mapping-close-btn" onClick={() => setExpandedDocId(null)}>✕</button>
                            </div>
                          </div>

                          {isMappingNow && (
                            <div className="mapping-loading">
                              <div className="mapping-spinner" />
                              Scanning PDF content and matching to UPSC syllabus topics…
                            </div>
                          )}

                          {!isMappingNow && visibleMappings && visibleMappings.length === 0 && (
                            <div className="mapping-empty">
                              No syllabus matches found in this document. Try re-mapping or
                              {" "}<button className="gen-link" onClick={() => onNavigate && onNavigate("syllabusmap")}>
                                add more topics to your syllabus
                              </button>.
                            </div>
                          )}

                          {!isMappingNow && visibleMappings && visibleMappings.length > 0 && (
                            <>
                              <div className="mapping-legend">
                                <span className="mapping-legend-item">
                                  <span className="mapping-legend-dot" /> Doc topic detected in PDF
                                </span>
                                <span className="mapping-legend-arrow">→</span>
                                <span className="mapping-legend-item">Matched UPSC syllabus point</span>
                                <span className="mapping-legend-del">✕ to remove irrelevant matches</span>
                              </div>
                              <div className="mapping-list">
                                {visibleMappings.map(m => (
                                  <div key={m.docTopic} className="mapping-item">
                                    <span className="mapping-doc-topic">{m.docTopic}</span>
                                    <span className="mapping-arrow">→</span>
                                    <div className="mapping-syl-info">
                                      <span
                                        className="mapping-paper-pill"
                                        style={{ background: m.paperBg, color: m.paperColor, borderColor: m.paperColor + "55" }}
                                      >
                                        {m.paperLabel}
                                      </span>
                                      <span className="mapping-syl-text">{m.syllabusText}</span>
                                    </div>
                                    <button
                                      className="mapping-del-btn"
                                      onClick={() => deleteMapping(doc.id, m.docTopic)}
                                      title="Remove this mapping"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info box */}
      <div className="info-box">
        <div className="info-box-icon">ℹ️</div>
        <div>
          <div className="info-box-title">How Syllabus Mapping works</div>
          <div className="info-box-desc">
            After a PDF is text-extracted ("AI-Searchable"), click <strong>📚 Map Topics</strong> to automatically
            detect topics from the document and match them to your UPSC Mains syllabus. You can delete any
            mapping that seems irrelevant. Use{" "}
            <button className="gen-link" onClick={() => onNavigate && onNavigate("syllabusmap")}>
              Manage Syllabus
            </button>{" "}
            to add or edit syllabus topics.
          </div>
        </div>
      </div>
    </div>
  );
}
