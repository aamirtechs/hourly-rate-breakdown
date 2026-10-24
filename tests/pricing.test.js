const test = require("node:test");
const assert = require("node:assert");
const { breakdown } = require("../pricing.js");

test("reproduces the brief's worked example exactly (no GST)", () => {
  const b = breakdown(100, false);
  assert.strictEqual(b.serviceFeeAndHst, 11.30);
  assert.strictEqual(b.stripeFee, 3.20);
  assert.strictEqual(b.gst, 0);
  assert.strictEqual(b.total, 114.50);
});

test("service fee and HST components are correct", () => {
  const b = breakdown(100, false);
  assert.strictEqual(b.serviceFee, 10.00);
  assert.strictEqual(b.hst, 1.30);
});

test("GST registered adds 5% GST on the base rate into the total", () => {
  const b = breakdown(100, true);
  assert.strictEqual(b.gst, 5.00);
  assert.strictEqual(b.total, 119.50);
});

test("scales and rounds to cents", () => {
  const b = breakdown(75, false);
  assert.strictEqual(b.serviceFee, 7.50);
  assert.strictEqual(b.hst, 0.98); // 7.50 * 0.13 = 0.975 -> 0.98
  assert.strictEqual(b.serviceFeeAndHst, 8.48);
  assert.strictEqual(b.stripeFee, 2.48); // 75 * 0.029 + 0.30 = 2.475 -> 2.48
  assert.strictEqual(b.total, 85.96);
});

test("zero and invalid rates are safe", () => {
  const b = breakdown(0, false);
  assert.strictEqual(b.total, 0);
  const c = breakdown("abc", true);
  assert.strictEqual(c.total, 0);
});
