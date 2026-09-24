#!/usr/bin/env node
// 开发期数据校验：node scripts/validate.mjs
// 校验 js/data.js 是否满足 doc/女儿的世界/04-技术方案建议.md 的 Schema 约定。
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "js", "data.js");
const errors = [];
const fail = (m) => errors.push(m);
const N = (v) => typeof v === "string" && v.trim().length > 0;

if (!existsSync(dataPath)) {
  console.error(`✗ 找不到 ${path.relative(root, dataPath)}`);
  process.exit(1);
}

const sandbox = { window: {} };
try {
  vm.runInNewContext(readFileSync(dataPath, "utf8"), sandbox, { filename: "data.js" });
} catch (e) {
  console.error(`✗ data.js 解析失败：${e.message}`);
  process.exit(1);
}
const D = sandbox.window.DATA;
if (!D || typeof D !== "object") {
  console.error("✗ window.DATA 未定义");
  process.exit(1);
}

// ---- archiveExample ----
const A = D.archiveExample || {};
for (const k of ["nickname", "grade", "intro", "idol", "music"]) {
  if (!N(A[k])) fail(`archiveExample.${k} 应为非空字符串`);
}
for (const k of ["tags", "works", "games"]) {
  if (!Array.isArray(A[k]) || A[k].length < 2 || !A[k].every(N)) {
    fail(`archiveExample.${k} 应为 ≥2 个非空字符串的数组`);
  }
}
if (!Array.isArray(A.recent) || A.recent.length < 1 || !N(A.recent[0]?.text)) {
  fail("archiveExample.recent 应为 [{text, date}] 数组且至少 1 条");
}

// ---- modules ----
const EXPECTED = [
  ["anime-goods", "二次元与谷子文化", "🎀", "#F4A7B9"],
  ["idol-star", "追星与偶像文化", "💫", "#C9A6E8"],
  ["webfiction-fanfic", "网文与同人创作", "📖", "#8EC5B6"],
  ["games-virtual", "游戏与虚拟世界", "🎮", "#7FB8E8"],
  ["music-trend", "音乐与潮流", "🎧", "#F7C774"],
  ["social-media", "社交媒体与黑话词典", "📱", "#E8A37F"],
  ["emotion-mind", "情感世界与心理状态", "🌷", "#E88FA0"],
  ["dream-self", "梦想与自我认同", "🌟", "#9BC8A0"],
];

if (!Array.isArray(D.modules) || D.modules.length !== 8) {
  fail(`modules 应为 8 个模块，实际 ${Array.isArray(D.modules) ? D.modules.length : "非数组"}`);
}

const ids = new Set();
const checkCards = (arr, label) => {
  if (!Array.isArray(arr) || arr.length < 2 || arr.length > 4) {
    fail(`${label} 应为 2-4 张卡片，实际 ${Array.isArray(arr) ? arr.length : "非数组"}`);
    return;
  }
  for (const c of arr) {
    if (!N(c?.title) || !N(c?.body)) fail(`${label} 存在缺少 title/body 的卡片`);
  }
};

for (const [i, m] of (D.modules || []).entries()) {
  const tag = `modules[${i}]`;
  const exp = EXPECTED[i];
  if (exp) {
    if (m.id !== exp[0]) fail(`${tag}.id 应为 ${exp[0]}，实际 ${m.id}`);
    if (m.title !== exp[1]) fail(`${tag}.title 应为「${exp[1]}」，实际「${m.title}」`);
    if (m.emoji !== exp[2]) fail(`${tag}.emoji 应为 ${exp[2]}`);
    if (String(m.color || "").toLowerCase() !== exp[3].toLowerCase()) {
      fail(`${tag}.color 应为 ${exp[3]}，实际 ${m.color}`);
    }
  }
  if (!/^[a-z0-9-]+$/.test(m.id || "")) fail(`${tag}.id 非法（应为小写 slug）`);
  if (ids.has(m.id)) fail(`${tag}.id 重复：${m.id}`);
  ids.add(m.id);
  if (!N(m.emoji)) fail(`${tag}.emoji 缺失`);
  if (!N(m.tagline)) fail(`${tag}.tagline 缺失`);
  if (!/^#[0-9a-fA-F]{6}$/.test(m.color || "")) fail(`${tag}.color 非法十六进制色值`);
  if (!Array.isArray(m.keywords) || m.keywords.length < 3 || !m.keywords.every(N)) {
    fail(`${tag}.keywords 应为 ≥3 个非空字符串（「她的世界」匹配用）`);
  }
  if (!Array.isArray(m.vocab) || m.vocab.length < 3) fail(`${tag}.vocab 应为 ≥3 个词条`);

  for (const stage of ["kinder", "primary", "junior", "senior"]) {
    const s = m[stage];
    if (!s) { fail(`${tag}.${stage} 缺失`); continue; }
    checkCards(s.what, `${tag}.${stage}.what`);
    checkCards(s.why, `${tag}.${stage}.why`);
    const h = s.how;
    if (!h) { fail(`${tag}.${stage}.how 缺失`); continue; }
    if (!Array.isArray(h.tips) || h.tips.length < 2 || h.tips.length > 3 || !h.tips.every(N)) {
      fail(`${tag}.${stage}.how.tips 应为 2-3 条非空话术`);
    }
    if (!N(h.advice)) fail(`${tag}.${stage}.how.advice 缺失`);
    if (!N(h.redline)) fail(`${tag}.${stage}.how.redline 缺失`);
  }
}

// ---- glossary ----
const G = D.glossary;
if (!Array.isArray(G) || G.length < 40) {
  fail(`glossary 应 ≥40 词条，实际 ${Array.isArray(G) ? G.length : "非数组"}`);
}
const terms = new Set();
for (const [i, g] of (G || []).entries()) {
  const tag = `glossary[${i}]`;
  if (!N(g.term)) fail(`${tag}.term 缺失`);
  else if (terms.has(g.term)) fail(`${tag} 词条重复：${g.term}`);
  if (g.term) terms.add(g.term);
  if (!N(g.meaning)) fail(`${tag}.meaning 缺失：${g.term}`);
  if (!N(g.reply)) fail(`${tag}.reply 缺失：${g.term}`);
  if (g.module !== "general" && !ids.has(g.module)) {
    fail(`${tag}.module 非法（${g.module}）：应为模块 id 或 general`);
  }
  if (typeof g.hot !== "boolean") fail(`${tag}.hot 应为 boolean：${g.term}`);
}

// ---- vocab ⊆ glossary ----
for (const m of D.modules || []) {
  for (const t of m.vocab || []) {
    if (!terms.has(t)) fail(`模块 ${m.id} 的 vocab「${t}」不在词典中`);
  }
}

// ---- guide ----
const Gd = D.guide || {};
if (!N(Gd.intro)) fail("guide.intro 缺失");
const checkList = (arr, label, n, keys) => {
  if (!Array.isArray(arr) || arr.length < n) {
    fail(`${label} 应为 ≥${n} 条的数组，实际 ${Array.isArray(arr) ? arr.length : "非数组"}`);
    return;
  }
  for (const [i, x] of arr.entries()) {
    for (const k of keys) if (!N(x?.[k])) fail(`${label}[${i}].${k} 缺失`);
  }
};
checkList(Gd.principles, "guide.principles", 5, ["title", "body"]);
checkList(Gd.methods, "guide.methods", 6, ["title", "when", "body"]);
checkList(Gd.donts, "guide.donts", 4, ["title", "body"]);
if (!Array.isArray(Gd.ages) || Gd.ages.length !== 2) {
  fail(`guide.ages 应为 2 组（幼儿园/小学），实际 ${Array.isArray(Gd.ages) ? Gd.ages.length : "非数组"}`);
} else {
  const wantStages = ["kinder", "primary"];
  Gd.ages.forEach((a, i) => {
    if (a?.stage !== wantStages[i]) fail(`guide.ages[${i}].stage 应为 ${wantStages[i]}`);
    if (!N(a?.title)) fail(`guide.ages[${i}].title 缺失`);
    if (!Array.isArray(a?.points) || a.points.length < 3 || !a.points.every(N)) {
      fail(`guide.ages[${i}].points 应为 ≥3 条非空字符串`);
    }
  });
}

// ---- tips ----
if (!Array.isArray(D.tips) || D.tips.length < 10 || !D.tips.every(N)) {
  fail(`tips 应为 ≥10 条非空字符串（今日小贴士轮换用）`);
}

if (errors.length) {
  console.error(`✗ 数据校验未通过（${errors.length} 项）：`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
const hotCount = (G || []).filter((g) => g.hot).length;
console.log(
  `✓ 数据校验通过：8 模块 × 幼儿园/小学/初中/高中 × 三层，词典 ${(G || []).length} 条（hot ${hotCount}），tips ${D.tips.length} 条，指南 ${Gd.principles?.length || 0} 原理 + ${Gd.methods?.length || 0} 方法`
);
