"use strict";

const fmt = (n) => "$" + n.toFixed(2);
const $ = (id) => document.getElementById(id);

function pct(x) { return (x * 100).toFixed(2).replace(/\.?0+$/, "") + "%"; }

function render() {
  const rate = parseFloat($("in-rate").value);
  const gstReg = $("in-gst").checked;
  const b = breakdown(rate, gstReg);

  $("out-base").textContent = fmt(b.base);
  $("fee-note").textContent = "(" + pct(CONFIG.serviceFeeRate) + " fee = " + fmt(b.serviceFee) + ", plus " + pct(CONFIG.hstRate) + " HST on the fee = " + fmt(b.hst) + ")";
  $("stripe-note").textContent = "(" + pct(CONFIG.stripeRate) + " of rate + " + fmt(CONFIG.stripeFixed) + ")";
  $("out-fee").value = fmt(b.serviceFeeAndHst);
  $("out-stripe").value = fmt(b.stripeFee);
  $("out-total").value = fmt(b.total);

  $("row-gst").hidden = !gstReg;
  if (gstReg) {
    $("gst-note").textContent = "(" + pct(CONFIG.gstRate) + " of the base rate)";
    $("out-gst").textContent = fmt(b.gst);
  }

  $("client-rate").textContent = fmt(b.total);
  $("r-base").textContent = fmt(b.base);
  $("r-fee").textContent = fmt(b.serviceFeeAndHst);
  $("r-stripe").textContent = fmt(b.stripeFee);
  $("r-total").textContent = fmt(b.total);
  $("r-gst-row").hidden = !gstReg;
  if (gstReg) $("r-gst").textContent = fmt(b.gst);
}

document.addEventListener("DOMContentLoaded", () => {
  $("in-rate").addEventListener("input", render);
  $("in-gst").addEventListener("change", render);
  $("btn-receipt").addEventListener("click", () => {
    const r = $("receipt");
    r.hidden = !r.hidden;
    $("btn-receipt").textContent = r.hidden ? "View price breakdown" : "Hide price breakdown";
  });
  render();
});
