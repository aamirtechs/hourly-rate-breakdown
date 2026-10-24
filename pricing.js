"use strict";

// Pricing logic for the freelancer hourly rate breakdown.
// Every percentage lives in CONFIG so the platform's exact tax rules
// can be matched in one place after reviewing the existing codebase.
//
// How the brief's worked example is reproduced exactly:
//   Base rate $100.00
//   PrideLink service fee = 10% of base            = $10.00
//   HST = 13% charged on the service fee           =  $1.30
//   PrideLink Service Fee & HST                    = $11.30
//   Stripe fee = 2.9% of base + $0.30              =  $3.20
//   Total displayed to client                      = $114.50
// If the freelancer is GST registered, GST (5%) on the base rate is
// included in the displayed total as its own line.

const CONFIG = {
  serviceFeeRate: 0.10, // PrideLink service fee, % of the base hourly rate
  hstRate: 0.13,        // HST charged on the service fee
  stripeRate: 0.029,    // Stripe percentage fee, on the base hourly rate
  stripeFixed: 0.30,    // Stripe fixed fee per booking hour unit
  gstRate: 0.05,        // GST on the base rate, only when GST registered
};

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function breakdown(baseRate, gstRegistered) {
  const base = round2(Math.max(0, Number(baseRate) || 0));
  const serviceFee = round2(base * CONFIG.serviceFeeRate);
  const hst = round2(serviceFee * CONFIG.hstRate);
  const serviceFeeAndHst = round2(serviceFee + hst);
  const stripeFee = base > 0 ? round2(base * CONFIG.stripeRate + CONFIG.stripeFixed) : 0;
  const gst = gstRegistered ? round2(base * CONFIG.gstRate) : 0;
  const total = round2(base + gst + serviceFeeAndHst + stripeFee);
  return { base, gstRegistered: !!gstRegistered, serviceFee, hst, serviceFeeAndHst, stripeFee, gst, total };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CONFIG, round2, breakdown };
}
