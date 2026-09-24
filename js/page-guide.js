/* ============================================================
   女儿的世界 · page-guide.js
   父女对话指南页：原理 / 方法 / 分年龄 / 禁忌，全部来自
   DATA.guide，只做转义渲染。
   ============================================================ */

(function () {
  var g = window.DATA.guide || {};

  document.getElementById("g-intro").textContent = g.intro || "";

  document.getElementById("g-principles").innerHTML = (g.principles || [])
    .map(function (p) {
      return '<div class="info-card"><h4>' + esc(p.title) + "</h4><p>" + esc(p.body) + "</p></div>";
    })
    .join("");

  document.getElementById("g-methods").innerHTML = (g.methods || [])
    .map(function (m, i) {
      return (
        '<div class="method-card">' +
        "<h4><span class=\"method-no\">" + (i + 1) + "</span>" + esc(m.title) + "</h4>" +
        '<span class="method-when">📍 ' + esc(m.when) + "</span>" +
        "<p>" + esc(m.body) + "</p>" +
        "</div>"
      );
    })
    .join("");

  document.getElementById("g-ages").innerHTML = (g.ages || [])
    .map(function (a) {
      return (
        '<div class="info-card">' +
        "<h4>" + esc(a.title) + "</h4>" +
        '<ul class="age-points">' +
        (a.points || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") +
        "</ul></div>"
      );
    })
    .join("");

  document.getElementById("g-donts").innerHTML = (g.donts || [])
    .map(function (d) {
      return (
        '<div class="info-card dont-card"><h4>✗ ' + esc(d.title) + "</h4><p>" + esc(d.body) + "</p></div>"
      );
    })
    .join("");

  initThemeSwitcher();
})();
