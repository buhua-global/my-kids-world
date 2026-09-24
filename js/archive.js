/* ============================================================
   女儿的世界 · archive.js
   档案存取（localStorage）。示例档案兜底：未保存过档案时展示
   DATA.archiveExample，编辑后才真正写入 localStorage。
   ============================================================ */

const ARCHIVE_KEY = "daughter-archive-v1";

function loadArchive() {
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : null;
  } catch (e) {
    return null;
  }
}

function saveArchive(archive) {
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
  } catch (e) {
    /* 存储不可用（如隐私模式）时静默降级 */
  }
}

function clearArchive() {
  try {
    localStorage.removeItem(ARCHIVE_KEY);
  } catch (e) {}
}

/* 年级 → 学段：幼儿园 / 一~六年级 / 初中 / 高中，四档 */
function gradeStage(grade) {
  var g = grade || "";
  if (/^幼儿园/.test(g)) return "kinder";
  if (/^[一二三四五六]年级/.test(g)) return "primary";
  return /^高/.test(g) ? "senior" : "junior";
}

/* 统一读档视图：没存过就用示例档案，并标记 isExample 供页面提示 */
function archiveView() {
  const saved = loadArchive();
  if (saved) return { archive: saved, isExample: false };
  return { archive: Object.assign({}, window.DATA.archiveExample), isExample: true };
}

/* 把一条「最近在追」插到时间线最前，自动记今天日期 */
function addRecent(text) {
  const view = archiveView();
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const date = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
  view.archive.recent = view.archive.recent || [];
  view.archive.recent.unshift({ text: text, date: date });
  saveArchive(view.archive);
  return view.archive;
}
