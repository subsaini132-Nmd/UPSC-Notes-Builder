import React, { useState, useRef } from "react";
import { SAMPLE_PDFS } from "../lib/constants";

export default function PDFLibrary() {
  const [pdfs, setPdfs] = useState(SAMPLE_PDFS);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf");
    addFiles(files);
  };

  const addFiles = (files) => {
    const newPdfs = files.map((f, i) => ({
      id: String(Date.now() + i),
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      pages: "—",
      chunks: 0,
      status: "queued",
      date: new Date().toISOString().slice(0, 10),
    }));
    setPdfs(prev => [...newPdfs, ...prev]);
  };

  const totalIndexed = pdfs.filter(p => p.status === "indexed").length;
  const totalChunks  = pdfs.filter(p => p.status === "indexed").reduce((s, p) => s + p.chunks, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">PDF Library</p>
          <h1 className="page-title">Source Documents</h1>
        </div>
        <button className="primary-btn" onClick={() => fileRef.current.click()}>
          + Upload PDF
        </button>
        <input ref={fileRef} type="file" accept=".pdf" multiple style={{ display:"none" }}
          onChange={e => addFiles(Array.from(e.target.files))} />
      </div>

      {/* Library stats */}
      <div className="library-stats">
        <div className="lib-stat"><span className="lib-stat-val">{pdfs.length}</span><span className="lib-stat-label">Total PDFs</span></div>
        <div className="lib-stat-div" />
        <div className="lib-stat"><span className="lib-stat-val">{totalIndexed}</span><span className="lib-stat-label">Indexed</span></div>
        <div className="lib-stat-div" />
        <div className="lib-stat"><span className="lib-stat-val">{totalChunks.toLocaleString()}</span><span className="lib-stat-label">Chunks Ready</span></div>
        <div className="lib-stat-div" />
        <div className="lib-stat"><span className="lib-stat-val">{pdfs.filter(p => p.status !== "indexed").length}</span><span className="lib-stat-label">Pending</span></div>
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
        <div className="drop-title">Drag & drop PDFs here</div>
        <div className="drop-sub">NCERT, Economic Survey, ARC Reports, PIB compilations, Current Affairs — any study material</div>
        <div className="drop-btn-label">or click to browse</div>
      </div>

      {/* PDF Table */}
      <div className="pdf-table-wrap">
        <table className="pdf-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Pages</th>
              <th>Size</th>
              <th>Chunks</th>
              <th>Status</th>
              <th>Uploaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pdfs.map(pdf => (
              <tr key={pdf.id}>
                <td>
                  <div className="pdf-table-name">
                    <span className="pdf-table-icon">📄</span>
                    <span>{pdf.name}</span>
                  </div>
                </td>
                <td className="pdf-table-meta">{pdf.pages}</td>
                <td className="pdf-table-meta">{pdf.size}</td>
                <td className="pdf-table-meta">
                  {pdf.status === "indexed" ? pdf.chunks.toLocaleString() : "—"}
                </td>
                <td>
                  <span className={`pdf-status-badge ${pdf.status}`}>
                    {pdf.status === "indexed"    && "✓ Indexed"}
                    {pdf.status === "processing" && "⚙ Processing"}
                    {pdf.status === "queued"     && "⏳ Queued"}
                  </span>
                </td>
                <td className="pdf-table-meta">{pdf.date}</td>
                <td>
                  <button className="pdf-action-btn"
                    onClick={() => setPdfs(prev => prev.filter(p => p.id !== pdf.id))}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info box */}
      <div className="info-box">
        <div className="info-box-icon">ℹ️</div>
        <div>
          <div className="info-box-title">How PDF Intelligence works</div>
          <div className="info-box-desc">
            Each uploaded PDF is parsed, split into 512-token chunks with 50-token overlap, and stored with embeddings. When you search for a topic, the system retrieves the most relevant chunks and sends them to Claude as context for generating your notes.
          </div>
        </div>
      </div>
    </div>
  );
}
