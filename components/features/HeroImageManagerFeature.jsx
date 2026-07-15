'use client'

import { useState, useRef } from "react";
import { HERO_TIERS } from "../../lib/heroes-data";

// Build folder list from HERO_TIERS (deduplicated)
function buildFolders() {
  const seen = new Set();
  return HERO_TIERS.map((tier) => ({
    folder: tier.folder,
    label: tier.label,
    names: tier.names,
  })).filter(({ folder }) => {
    if (seen.has(folder)) return false;
    seen.add(folder);
    return true;
  });
}

const FOLDERS = buildFolders();

// Match a file against heroes in the selected folder tier(s)
function matchHeroInFolder(filename, folderPath) {
  const tiersInFolder = HERO_TIERS.filter((t) => t.folder === folderPath);
  const allNames = tiersInFolder.flatMap((t) => t.names);
  const baseName = filename.replace(/\.(png|jpe?g|webp|gif)$/i, "");
  const matched = allNames.find((name) => name === baseName);
  return matched || null;
}

function isImageFile(file) {
  return /\.(png|jpe?g|webp|gif)$/i.test(file.name);
}

// Recursively walk a DataTransfer entry tree to collect all File objects
async function walkEntry(entry) {
  if (entry.isFile) {
    return new Promise((resolve) => entry.file((f) => resolve([f]), () => resolve([])));
  }
  if (entry.isDirectory) {
    return new Promise((resolve) => {
      const reader = entry.createReader();
      const all = [];
      const readBatch = () => {
        reader.readEntries(async (batch) => {
          if (!batch.length) {
            const nested = await Promise.all(all.map(walkEntry));
            resolve(nested.flat());
            return;
          }
          all.push(...batch);
          readBatch();
        }, () => resolve([]));
      };
      readBatch();
    });
  }
  return [];
}

async function filesFromDataTransfer(dataTransfer) {
  const items = Array.from(dataTransfer?.items || []);
  if (!items.length) return Array.from(dataTransfer?.files || []);

  const entries = items
    .map((item) =>
      typeof item.webkitGetAsEntry === "function" ? item.webkitGetAsEntry() : null
    )
    .filter(Boolean);

  if (!entries.length) return Array.from(dataTransfer.files || []);

  const nested = await Promise.all(entries.map(walkEntry));
  return nested.flat();
}

export function HeroImageManagerFeature() {
  const [selectedFolder, setSelectedFolder] = useState(FOLDERS[0]?.folder || null);
  const [fileEntries, setFileEntries] = useState([]); // [{ file, objectUrl, targetPath, status, heroName }]
  const [isDragOver, setIsDragOver] = useState(false);
  const [warnMsg, setWarnMsg] = useState("");
  const fileInputRef = useRef(null);

  function addFiles(files) {
    if (!selectedFolder) {
      setWarnMsg("กรุณาเลือก folder ก่อนเพิ่มไฟล์");
      return;
    }
    const images = files.filter(isImageFile);
    if (!images.length) {
      setWarnMsg("ไม่เจอไฟล์รูปภาพในสิ่งที่เลือก");
      return;
    }
    setWarnMsg("");
    const entries = images.map((file) => {
      const heroName = matchHeroInFolder(file.name, selectedFolder);
      return {
        file,
        objectUrl: URL.createObjectURL(file),
        targetPath: `${selectedFolder}/${file.name}`,
        status: heroName ? "match" : "unknown",
        heroName: heroName || "",
      };
    });
    setFileEntries(entries);
  }

  function handleFolderSelect(folder) {
    // Revoke old preview URLs
    fileEntries.forEach((e) => URL.revokeObjectURL(e.objectUrl));
    setFileEntries([]);
    setSelectedFolder(folder);
    setWarnMsg("");
  }

  function handlePickFiles() {
    fileInputRef.current?.click();
  }

  function handleFileInputChange(e) {
    addFiles(Array.from(e.target.files || []));
    e.target.value = "";
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (selectedFolder) setIsDragOver(true);
  }

  function handleDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }

  async function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    if (!selectedFolder) return;
    const files = await filesFromDataTransfer(e.dataTransfer);
    addFiles(files);
  }

  const matchCount = fileEntries.filter((e) => e.status === "match").length;
  const unknownCount = fileEntries.length - matchCount;

  return (
    <section className="feature-block">
      <div className="feature-head">
        <div>
          <p className="feature-kicker">Hero image manager</p>
          <h2>เพิ่มไฟล์ตัวละคร</h2>
          <p className="hint">
            เลือก folder ปลายทางก่อน แล้วค่อยเพิ่มไฟล์รูปภาพ
          </p>
        </div>
      </div>

      {/* ── Folder picker ── */}
      <div className="image-folder-grid">
        {FOLDERS.map(({ folder, label, names }) => (
          <button
            key={folder}
            className={`image-folder-card${folder === selectedFolder ? " active" : ""}`}
            type="button"
            onClick={() => handleFolderSelect(folder)}
          >
            <span>{label}</span>
            <b>{folder}</b>
            <small>{names.length} ตัวละคร</small>
          </button>
        ))}
      </div>

      {/* ── Drop zone ── */}
      <div
        className={`image-upload-box${isDragOver ? " drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="image-upload-icon">+</div>
        <div className="image-upload-title">
          {selectedFolder
            ? `เพิ่มรูปเข้า ${selectedFolder}`
            : "เลือก folder ก่อน"}
        </div>
        <div className="image-upload-sub">
          {selectedFolder
            ? `ไฟล์จะถูกเตรียมไว้สำหรับ public/images/${selectedFolder}/`
            : "หลังเลือก folder แล้วกดเพิ่มไฟล์หรือลากรูปมาวางตรงนี้"}
        </div>

        <button
          className="btn btn-primary"
          type="button"
          disabled={!selectedFolder}
          onClick={handlePickFiles}
        >
          เพิ่มไฟล์รูปภาพ
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
      </div>

      {warnMsg && <p className="form-warn">{warnMsg}</p>}

      {/* ── Results ── */}
      {fileEntries.length > 0 && (
        <div className="image-manager-result">
          <div className="image-manager-summary">
            <div><span>Folder</span><b>{selectedFolder}</b></div>
            <div><span>ไฟล์ทั้งหมด</span><b>{fileEntries.length}</b></div>
            <div><span>ชื่อตรงตัวละคร</span><b>{matchCount}</b></div>
            <div><span>ต้องตรวจชื่อ</span><b>{unknownCount}</b></div>
          </div>

          <div className="image-file-grid">
            {fileEntries.map((entry) => (
              <div
                key={entry.targetPath}
                className={`image-file-card ${entry.status}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={entry.objectUrl} alt={entry.file.name} />
                <div className="image-file-info">
                  <b>{entry.file.name}</b>
                  <code>public/images/{entry.targetPath}</code>
                  <span>
                    {entry.status === "match"
                      ? "ชื่อไฟล์ตรงกับตัวละคร"
                      : "ชื่อไฟล์ยังไม่ตรงกับรายชื่อตัวละครใน folder นี้"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="image-check-note">
            ขั้นนี้เป็นการเตรียม/ตรวจไฟล์เท่านั้น ยังไม่ได้เขียนไฟล์เข้า GitHub หรือ Cloudflare อัตโนมัติ
          </p>

          {/* TODO: add "Upload to GitHub / Cloudflare" action once upload endpoint is implemented */}
        </div>
      )}

      {fileEntries.length === 0 && !warnMsg && (
        <div className="image-manager-empty">
          เลือก folder แล้วเพิ่มไฟล์รูป ระบบจะแสดง preview และ path ปลายทางให้ตรวจอีกครั้ง
        </div>
      )}
    </section>
  );
}
