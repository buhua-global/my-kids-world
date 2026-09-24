/* ============================================================
   女儿的世界 · ui.js
   页面级渲染小工具：转义、贴纸/气泡/红线卡 HTML、模块卡、
   今日小贴士。所有用户可编辑内容（档案字段）必须经过 esc()
   或 textContent 渲染，避免把输入当 HTML 执行。
   ============================================================ */

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const STICKERS = {
  what: ["sticker-what", "📌 这是什么"],
  why: ["sticker-why", "💗 她为什么喜欢"],
  how: ["sticker-how", "💬 怎么聊"]
};

function stickerHTML(kind) {
  const s = STICKERS[kind] || STICKERS.what;
  return '<span class="sticker ' + s[0] + '">' + s[1] + "</span>";
}

function bubbleHTML(text) {
  return '<p class="bubble">' + esc(text) + "</p>";
}

function redlineHTML(text) {
  return (
    '<div class="redline"><div class="redline-title">小心别踩雷</div><p>' +
    esc(text) +
    "</p></div>"
  );
}

function adviceHTML(text) {
  return (
    '<div class="advice-block"><div class="advice-title">可以这样做</div><p>' +
    esc(text) +
    "</p></div>"
  );
}

var STAGE_LABELS = { kinder: "幼儿园篇", primary: "小学篇", junior: "初中篇", senior: "高中篇" };

function stageLabel(stage) {
  return STAGE_LABELS[stage] || "初中篇";
}

/* 模块卡：顶部色条颜色来自模块自身品牌色，不随主题变 */
function moduleCardHTML(m) {
  return (
    '<a class="module-card" style="--mcolor:' +
    esc(m.color) +
    '" href="pages/module.html?id=' +
    encodeURIComponent(m.id) +
    '">' +
    '<span class="m-stage"><i>幼</i><i>小</i><i>初</i><i>高</i></span>' +
    '<div class="m-emoji">' +
    esc(m.emoji) +
    "</div>" +
    '<div class="m-title">' +
    esc(m.title) +
    "</div>" +
    '<div class="m-tagline">' +
    esc(m.tagline) +
    "</div>" +
    "</a>"
  );
}

/* 今日小贴士：按天轮换，同一天刷新页面不换 */
function todayTip() {
  const tips = window.DATA.tips;
  return tips[Math.floor(Date.now() / 86400000) % tips.length];
}

/* 词典热词 → glossary.html?q=词 */
function glossLink(term, extraClass) {
  return (
    '<a class="' +
    (extraClass || "") +
    '" href="glossary.html?q=' +
    encodeURIComponent(term) +
    '">' +
    esc(term) +
    "</a>"
  );
}
