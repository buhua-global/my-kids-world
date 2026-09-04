/* ============================================================
   女儿的世界 · page-module.js
   模块详情页：?id= 定位模块；学段默认跟随档案年级（高×→高中篇），
   贴「推荐」点；三层内容（是什么/她为什么喜欢/怎么聊）；
   「她的世界」匹配卡——档案里提到本模块关键词时提示；
   模块词汇 chips 链到词典搜索。
   ============================================================ */

(function () {
  var id = new URLSearchParams(location.search).get("id");
  var m = null;
  for (var i = 0; i < window.DATA.modules.length; i++) {
    if (window.DATA.modules[i].id === id) { m = window.DATA.modules[i]; break; }
  }
  if (!m) { location.replace("../index.html"); return; }

  document.title = m.title + " · 女儿的世界";
  document.getElementById("m-emoji").textContent = m.emoji;
  document.getElementById("m-title").textContent = m.title;
  document.getElementById("m-tagline").textContent = m.tagline;

  var view = archiveView();
  var a = view.archive;
  var recStage = gradeStage(a.grade);

  /* 「她的世界」匹配：档案的作品/爱豆/游戏/音乐里出现本模块关键词 */
  var hay = []
    .concat(a.works || [])
    .concat(a.idol ? [a.idol] : [])
    .concat(a.games || [])
    .concat(a.music ? String(a.music).split(/[、，,]/) : [])
    .join(" ")
    .toLowerCase();
  var hits = (m.keywords || []).filter(function (k) {
    return hay.indexOf(String(k).toLowerCase()) !== -1;
  });
  if (hits.length) {
    document.getElementById("match-zone").innerHTML =
      '<div class="match-card">' +
      '<div class="match-title">她的世界里有这个世界</div>' +
      "<p>在小宇宙里提到了：" + esc(hits.join("、")) +
      "。从这里聊起，可能最自然。</p></div>";
  } else if (view.isExample) {
    document.getElementById("match-zone").innerHTML =
      '<div class="banner-tip">👀 现在显示的是示例档案。去<a href="archive.html">编辑小宇宙</a>，这里会更像她。</div>';
  }

  var seg = document.getElementById("stage-seg");
  var btns = seg.querySelectorAll(".seg-btn");
  var current = recStage;

  function syncSeg() {
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      var on = b.dataset.stage === current;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.classList.toggle("recommended", b.dataset.stage === recStage);
    }
  }

  function cardHTML(c) {
    return '<div class="info-card"><h4>' + esc(c.title) + "</h4><p>" + esc(c.body) + "</p></div>";
  }

  function render() {
    var c = m[current];
    var html = "";

    html += '<div class="layer">' + stickerHTML("what") + '<div class="layer-cards">';
    html += (c.what || []).map(cardHTML).join("");
    html += "</div></div>";

    html += '<div class="layer">' + stickerHTML("why") + '<div class="layer-cards">';
    html += (c.why || []).map(cardHTML).join("");
    html += "</div></div>";

    html += '<div class="layer">' + stickerHTML("how");
    html += '<div class="bubbles-label">可以这样开场</div>';
    html += (c.how.tips || []).map(bubbleHTML).join("");
    html += adviceHTML(c.how.advice);
    html += redlineHTML(c.how.redline);
    html += "</div>";

    document.getElementById("content").innerHTML = html;
  }

  seg.addEventListener("click", function (e) {
    var b = e.target.closest(".seg-btn");
    if (!b) return;
    current = b.dataset.stage;
    syncSeg();
    render();
  });

  document.getElementById("vocab-chips").innerHTML = (m.vocab || [])
    .map(function (t) {
      return '<a class="chip" href="glossary.html?q=' + encodeURIComponent(t) + '">' + esc(t) + "</a>";
    })
    .join("");

  syncSeg();
  render();
  initThemeSwitcher();
})();
