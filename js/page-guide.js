/* ============================================================
   女儿的世界 · page-guide.js
   父女对话指南页：原理 / 方法 / 分年龄 / 禁忌，全部来自
   DATA.guide，只做转义渲染。
   ============================================================ */

(function () {
  var g = window.DATA.guide || {};

  document.getElementById("g-intro").textContent = g.intro || "";

  document.getElementById("g-principles").innerHTML = (g.principles || [])
    .map(function (p, i) {
      return (
        '<article class="doc-item">' +
        '<div class="doc-head"><span class="doc-no" aria-hidden="true">' + (i + 1) + "</span>" +
        "<h4>" + esc(p.title) + "</h4></div>" +
        "<p>" + esc(p.body) + "</p></article>"
      );
    })
    .join("");

  document.getElementById("g-methods").innerHTML = (g.methods || [])
    .map(function (m, i) {
      return (
        '<article class="doc-item">' +
        '<div class="doc-head"><span class="doc-no" aria-hidden="true">' + (i + 1) + "</span>" +
        "<h4>" + esc(m.title) + "</h4></div>" +
        '<span class="doc-when">' + esc(m.when) + "</span>" +
        "<p>" + esc(m.body) + "</p>" +
        "</article>"
      );
    })
    .join("");

  document.getElementById("g-ages").innerHTML = (g.ages || [])
    .map(function (a) {
      return (
        '<article class="doc-item">' +
        "<h4>" + esc(a.title) + "</h4>" +
        '<ul class="age-points">' +
        (a.points || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") +
        "</ul></article>"
      );
    })
    .join("");

  document.getElementById("g-donts").innerHTML = (g.donts || [])
    .map(function (d, i) {
      return (
        '<article class="doc-item dont">' +
        '<div class="doc-head"><span class="doc-no" aria-hidden="true">' + (i + 1) + "</span>" +
        "<h4>" + esc(d.title) + "</h4></div>" +
        "<p>" + esc(d.body) + "</p></article>"
      );
    })
    .join("");

  initThemeSwitcher();
  initReveal();
})();
