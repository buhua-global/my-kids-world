/* ============================================================
   女儿的世界 · page-archive.js
   「女儿的小宇宙」档案页：浏览 / 编辑两种模式。
   未保存过档案时展示示例档案（可一键清空回来）；
   「最近在追」随时追加并自动记日期。
   所有档案字段都是用户输入：渲染一律 esc() / textContent。
   ============================================================ */

(function () {
  var FACTION_PRESETS = [
    "学霸", "二次元", "追星族", "地雷妹", "辣妹", "运动系", "综合型"
  ];

  var TAG_PRESETS = [
    "慢热", "细腻", "社恐", "e人", "i人", "开朗", "安静",
    "爱画画", "爱运动", "追星族", "二次元", "游戏迷", "书虫", "音乐控"
  ];

  var el = function (id) { return document.getElementById(id); };

  function current() {
    return archiveView();
  }

  /* ---------- 浏览模式 ---------- */

  function renderView() {
    var v = current();
    var a = v.archive;
    var nick = (a.nickname || "").trim();

    el("p-avatar").textContent = nick ? nick.charAt(0) : "🌸";
    el("p-name").innerHTML =
      esc(nick || "女儿") + (v.isExample ? ' <span class="badge-example">示例档案</span>' : "");
    el("p-intro").textContent = a.intro || "还没有介绍她——点下面的「编辑档案」写一句吧。";

    var factionChip = a.faction
      ? '<span class="chip chip-faction">' + esc(a.faction) + "</span>"
      : "";
    var tagChips = (a.tags && a.tags.length)
      ? a.tags.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("")
      : "";
    el("p-tags").innerHTML = (factionChip + tagChips) || '<span class="empty-hint">还没选派系和标签</span>';

    var kv = [
      ["喜欢的作品", (a.works || []).join("、")],
      ["喜欢的爱豆 / 人物", a.idol || ""],
      ["玩的游戏", (a.games || []).join("、")],
      ["常听的音乐", a.music || ""]
    ];
    el("p-kv").innerHTML = kv
      .map(function (p) {
        return (
          '<div class="kv"><div class="kv-label">' + p[0] +
          '</div><div class="kv-value">' +
          (p[1] ? esc(p[1]) : '<span class="empty-hint">还没填</span>') +
          "</div></div>"
        );
      })
      .join("");

    el("p-recent").innerHTML = (a.recent && a.recent.length)
      ? a.recent
          .map(function (r) {
            return (
              "<li><div>" + esc(r.text) +
              '</div><div class="t-date">' + esc(r.date || "早些时候") + "</div></li>"
            );
          })
          .join("")
      : '<li><div><span class="empty-hint">还没有记录，从下面记一笔开始。</span></div></li>';

    el("p-notes").innerHTML = (a.notes || "")
      ? esc(a.notes)
      : '<span class="empty-hint">留给自己的一句话：想留意她的什么？</span>';

    el("example-banner").innerHTML = v.isExample
      ? '<div class="banner-tip">👀 这是一个示例档案，看看页面长什么样。<a href="#" id="link-edit">编辑成你女儿的</a></div>'
      : "";
    var link = el("link-edit");
    if (link) link.addEventListener("click", function (e) { e.preventDefault(); openEdit(); });

    el("btn-clear").hidden = v.isExample;
  }

  /* ---------- 编辑模式 ---------- */

  function tagChipsHTML(selected) {
    return TAG_PRESETS.map(function (t) {
      var on = (selected || []).indexOf(t) !== -1;
      return (
        '<button type="button" class="chip chip-btn" data-tag="' + esc(t) +
        '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(t) + "</button>"
      );
    }).join("");
  }

  function factionChipsHTML(selected) {
    return FACTION_PRESETS.map(function (t) {
      var on = selected === t;
      return (
        '<button type="button" class="chip chip-btn" data-faction="' + esc(t) +
        '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(t) + "</button>"
      );
    }).join("");
  }

  function openEdit() {
    var a = current().archive;
    el("f-nickname").value = a.nickname || "";
    el("f-grade").value = a.grade || "初二";
    el("f-faction").innerHTML = factionChipsHTML(a.faction || "");
    el("f-tags").innerHTML = tagChipsHTML(a.tags);
    el("f-intro").value = a.intro || "";
    el("f-works").value = (a.works || []).join("、");
    el("f-idol").value = a.idol || "";
    el("f-games").value = (a.games || []).join("、");
    el("f-music").value = a.music || "";
    el("f-notes").value = a.notes || "";
    el("view-mode").hidden = true;
    el("edit-mode").hidden = false;
  }

  function closeEdit() {
    el("edit-mode").hidden = true;
    el("view-mode").hidden = false;
    renderView();
  }

  function splitList(s) {
    return String(s || "")
      .split(/[、，,]/)
      .map(function (x) { return x.trim(); })
      .filter(Boolean);
  }

  el("f-faction").addEventListener("click", function (e) {
    var b = e.target.closest(".chip-btn");
    if (!b) return;
    var wasOn = b.getAttribute("aria-pressed") === "true";
    el("f-faction").querySelectorAll('.chip-btn[aria-pressed="true"]').forEach(function (x) {
      x.setAttribute("aria-pressed", "false");
    });
    b.setAttribute("aria-pressed", wasOn ? "false" : "true");
  });

  el("f-tags").addEventListener("click", function (e) {
    var b = e.target.closest(".chip-btn");
    if (!b) return;
    b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
  });

  el("edit-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var chosen = [];
    el("f-tags").querySelectorAll('.chip-btn[aria-pressed="true"]').forEach(function (b) {
      chosen.push(b.dataset.tag);
    });
    var factionEl = el("f-faction").querySelector('.chip-btn[aria-pressed="true"]');
    saveArchive({
      nickname: el("f-nickname").value.trim(),
      grade: el("f-grade").value,
      faction: factionEl ? factionEl.dataset.faction : "",
      tags: chosen,
      intro: el("f-intro").value.trim(),
      works: splitList(el("f-works").value),
      idol: el("f-idol").value.trim(),
      games: splitList(el("f-games").value),
      music: el("f-music").value.trim(),
      recent: current().archive.recent || [],
      notes: el("f-notes").value.trim()
    });
    closeEdit();
  });

  el("btn-edit").addEventListener("click", openEdit);
  el("btn-cancel").addEventListener("click", closeEdit);
  el("btn-clear").addEventListener("click", function () {
    if (confirm("清空档案并回到示例？这一步没法撤销。")) {
      clearArchive();
      location.reload();
    }
  });

  el("r-add").addEventListener("click", function () {
    var input = el("r-text");
    var t = input.value.trim();
    if (!t) return;
    addRecent(t);
    input.value = "";
    renderView();
  });
  el("r-text").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      el("r-add").click();
    }
  });

  renderView();
  initThemeSwitcher();
  initReveal();
})();
