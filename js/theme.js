/* 主题系统：data-theme 属性 + localStorage（doc/04 §3） */
window.THEMES = [
  { id: "journal", name: "温暖手账", swatches: ["#F4A7B9", "#8EC5B6", "#F7D774"] },
  { id: "dream", name: "梦幻星空", swatches: ["#9B8CE6", "#7FC8E8", "#FFC7DE"] },
  { id: "minimal", name: "简约现代", swatches: ["#D98E9C", "#9AA8A0", "#D9C8A9"] },
  { id: "vintage", name: "复古日记", swatches: ["#B0714B", "#7C8C6E", "#C9A66B"] }
];

const THEME_KEY = "dw-theme";

function applyTheme(name) {
  document.documentElement.dataset.theme = name;
  try { localStorage.setItem(THEME_KEY, name); } catch (e) { /* 隐私模式等场景忽略 */ }
}

function currentTheme() {
  return document.documentElement.dataset.theme || "journal";
}

function initThemeSwitcher() {
  const zone = document.querySelector(".theme-zone");
  if (!zone) return;
  const btn = zone.querySelector(".theme-btn");
  const pop = zone.querySelector(".theme-pop");
  if (!btn || !pop) return;

  pop.innerHTML = window.THEMES.map(
    (t) => `
    <button type="button" class="theme-opt" role="menuitemradio"
            aria-checked="${t.id === currentTheme()}" data-theme-id="${t.id}">
      <span class="swatches">${t.swatches.map((c) => `<i style="background:${c}"></i>`).join("")}</span>
      <span>${t.name}</span>
    </button>`
  ).join("");
  pop.querySelectorAll(".theme-opt").forEach((o) => {
    o.classList.toggle("current", o.dataset.themeId === currentTheme());
  });

  btn.setAttribute("aria-expanded", "false");

  function setOpen(open) {
    pop.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!pop.classList.contains("open"));
  });

  pop.addEventListener("click", (e) => {
    const opt = e.target.closest(".theme-opt");
    if (!opt) return;
    applyTheme(opt.dataset.themeId);
    pop.querySelectorAll(".theme-opt").forEach((o) => {
      const isCur = o.dataset.themeId === opt.dataset.themeId;
      o.classList.toggle("current", isCur);
      o.setAttribute("aria-checked", isCur ? "true" : "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (!zone.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && pop.classList.contains("open")) {
      setOpen(false);
      btn.focus();
    }
  });
}
