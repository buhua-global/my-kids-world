/* ============================================================
   女儿的世界 · page-glossary.js
   黑话词典：即时搜索（词义/接话全文匹配）+ 按世界分类 tabs，
   ?q= 预填搜索词（模块页词汇 chips 跳转过来）。
   每张卡可展开「可以这样接」的话术。
   ============================================================ */

(function () {
  var el = function (id) { return document.getElementById(id); };

  var moduleName = {};
  window.DATA.modules.forEach(function (m) { moduleName[m.id] = m.title; });

  var TABS = [{ id: "all", label: "全部" }, { id: "general", label: "通用" }]
    .concat(window.DATA.modules.map(function (m) { return { id: m.id, label: m.title }; }));

  var tab = "all";

  el("g-tabs").innerHTML = TABS.map(function (t) {
    return (
      '<button type="button" class="tab-btn" role="tab" data-tab="' + t.id +
      '" aria-selected="false">' + esc(t.label) + "</button>"
    );
  }).join("");

  function cardHTML(g) {
    var modTag = g.module === "general"
      ? '<span class="g-module">通用</span>'
      : '<span class="g-module">' + esc(moduleName[g.module] || "") + "</span>";
    return (
      '<div class="gloss-card">' +
      '<div class="g-term">' + esc(g.term) + modTag +
      (g.hot ? '<span class="g-hot">🔥 热</span>' : "") +
      "</div>" +
      '<div class="g-meaning">' + esc(g.meaning) + "</div>" +
      '<button type="button" class="gloss-toggle">看看怎么接话 ▾</button>' +
      '<div class="reply-block"><div class="r-label">可以这样接</div>' + esc(g.reply) + "</div>" +
      "</div>"
    );
  }

  function render() {
    var q = el("g-search").value.trim().toLowerCase();
    var list = window.DATA.glossary.filter(function (g) {
      if (tab !== "all" && g.module !== tab) return false;
      if (!q) return true;
      return (g.term + g.meaning + g.reply).toLowerCase().indexOf(q) !== -1;
    });

    el("g-list").innerHTML = list.map(cardHTML).join("");
    el("g-empty").hidden = list.length > 0;
  }

  el("g-tabs").addEventListener("click", function (e) {
    var b = e.target.closest(".tab-btn");
    if (!b) return;
    tab = b.dataset.tab;
    el("g-tabs").querySelectorAll(".tab-btn").forEach(function (x) {
      var on = x === b;
      x.classList.toggle("on", on);
      x.setAttribute("aria-selected", on ? "true" : "false");
    });
    render();
  });

  el("g-list").addEventListener("click", function (e) {
    var b = e.target.closest(".gloss-toggle");
    if (!b) return;
    var block = b.nextElementSibling;
    var open = block.classList.toggle("open");
    b.textContent = open ? "收起来 ▴" : "看看怎么接话 ▾";
  });

  el("g-search").addEventListener("input", render);

  var q0 = new URLSearchParams(location.search).get("q");
  if (q0) el("g-search").value = q0;

  el("g-tabs").querySelector('.tab-btn[data-tab="all"]').classList.add("on");
  el("g-tabs").querySelector('.tab-btn[data-tab="all"]').setAttribute("aria-selected", "true");
  render();
  initThemeSwitcher();
  initReveal();
})();
