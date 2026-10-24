"use strict";

const fmt = (n) => "$" + n.toFixed(2);
const $ = (id) => document.getElementById(id);

function pct(x) { return (x * 100).toFixed(2).replace(/\.?0+$/, "") + "%"; }

// Smoothly tween a displayed money value toward its target.
const tweens = new Map();
function tween(el, to, isInput) {
  const from = tweens.has(el) ? tweens.get(el).current : to;
  if (tweens.has(el)) cancelAnimationFrame(tweens.get(el).raf);
  const start = performance.now();
  const dur = 260;
  const state = { current: from, raf: 0 };
  tweens.set(el, state);
  const step = (t) => {
    const k = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - k, 3);
    state.current = from + (to - from) * eased;
    const text = fmt(state.current);
    if (isInput) el.value = text; else el.textContent = text;
    if (k < 1) state.raf = requestAnimationFrame(step);
  };
  state.raf = requestAnimationFrame(step);
}

function render(animate) {
  const rate = parseFloat($("in-rate").value);
  const gstReg = $("in-gst").checked;
  const b = breakdown(rate, gstReg);

  $("out-base").textContent = fmt(b.base);
  $("fee-note").textContent = "(" + pct(CONFIG.serviceFeeRate) + " fee = " + fmt(b.serviceFee) + ", plus " + pct(CONFIG.hstRate) + " HST on the fee = " + fmt(b.hst) + ")";
  $("stripe-note").textContent = "(" + pct(CONFIG.stripeRate) + " of rate + " + fmt(CONFIG.stripeFixed) + ")";

  if (animate) {
    tween($("out-fee"), b.serviceFeeAndHst, true);
    tween($("out-stripe"), b.stripeFee, true);
    tween($("out-total"), b.total, true);
    tween($("client-rate"), b.total, false);
  } else {
    $("out-fee").value = fmt(b.serviceFeeAndHst);
    $("out-stripe").value = fmt(b.stripeFee);
    $("out-total").value = fmt(b.total);
    $("client-rate").textContent = fmt(b.total);
  }

  $("row-gst").hidden = !gstReg;
  if (gstReg) {
    $("gst-note").textContent = "(" + pct(CONFIG.gstRate) + " of the base rate)";
    $("out-gst").textContent = fmt(b.gst);
  }

  $("r-base").textContent = fmt(b.base);
  $("r-fee").textContent = fmt(b.serviceFeeAndHst);
  $("r-stripe").textContent = fmt(b.stripeFee);
  $("r-total").textContent = fmt(b.total);
  $("r-gst-row").hidden = !gstReg;
  if (gstReg) $("r-gst").textContent = fmt(b.gst);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  $("btn-theme").textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) applyTheme("dark");
  $("btn-theme").addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });
  $("in-rate").addEventListener("input", () => render(true));
  $("in-gst").addEventListener("change", () => render(true));
  $("btn-receipt").addEventListener("click", () => {
    const r = $("receipt");
    r.hidden = !r.hidden;
    $("btn-receipt").textContent = r.hidden ? "View price breakdown" : "Hide price breakdown";
    $("btn-receipt").setAttribute("aria-expanded", String(!r.hidden));
  });
  render(false);
});
