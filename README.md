# Hourly Rate Breakdown

An interactive demo of a freelancer hourly rate pricing breakdown, built to
the PrideLink brief: a freelancer enters a base on-demand hourly rate and
their GST registration status, and the platform calculates the service fee
with HST, the Stripe processing fee, and the total hourly rate displayed to
the client. Calculated fields are read-only.

This is a proposal demo. In production the same logic would be integrated
into the existing PrideLink application after reviewing its current pricing,
tax and payment code, as the brief requires.

## The math (matches the brief's worked example exactly)

| Line | Rule | On $100.00 |
| --- | --- | --- |
| Your On Demand Hourly Rate | entered by the freelancer | $100.00 |
| PrideLink service fee | 10% of the base rate | $10.00 |
| HST | 13% charged on the service fee | $1.30 |
| PrideLink Service Fee & HST | fee + HST | $11.30 |
| Stripe Payment Processing Fee | 2.9% of the base rate + $0.30 | $3.20 |
| GST (only if GST registered) | 5% of the base rate, included in the displayed total | $5.00 |
| Total Hourly Rate Displayed to Client | base + GST + fee & HST + Stripe | $114.50 (no GST) / $119.50 (GST) |

All percentages live in one `CONFIG` block at the top of `pricing.js`, so
matching the platform's production tax rules means changing five numbers in
one place. Amounts are rounded to cents per line, consistently, so the
profile setup, the booking flow and the client receipt always agree.

## Run it locally

```bash
cd hourly-rate-breakdown
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` as a file also works.

## Tests

```bash
node --test tests/pricing.test.js
```

The suite pins the brief's worked example to the cent, plus the GST case,
a rounding case, and zero/invalid input handling. 5 tests, no packages.

## Files

- `index.html` freelancer setup view and client-facing view
- `style.css` styling, responsive
- `pricing.js` the calculation logic and CONFIG (pure, unit-tested)
- `app.js` DOM wiring only
- `tests/pricing.test.js` calculation tests (Node 18+)

## Design

Marketplace-style UI (v1.2.0): the page is dressed the way Upwork and
Fiverr dress theirs, branded for PrideLink in plum and gold. A sticky
marketplace top bar with logo, search pill and profile avatar; a settings
breadcrumb; a freelancer profile card (cover strip, verified name, star
rating, Top Rated badge, earnings stats) whose GST-registered badge
appears live when the GST switch is on; a "Set your hourly rate" settings
panel with info tooltips and a Fiverr-green Save button; and a sticky
client booking box with the all-in price, booking CTA, receipt breakdown
and trust assurances. Sora headings, Plus Jakarta Sans body, animated
total transitions, full dark mode.

## Dependencies and third-party assets

No frameworks, no libraries, no images. One third-party asset: the fonts
Sora and Plus Jakarta Sans, loaded from Google Fonts under the SIL Open
Font License 1.1. If the fonts cannot load (for example offline), the app
falls back to the system font stack and remains fully usable.

## Assumptions to confirm with PrideLink

1. The fee bases above are reverse-engineered from the brief's example:
   service fee on the base rate, HST on the fee, Stripe on the base rate.
2. GST treatment for registered freelancers: GST on the base rate, shown as
   its own line and included in the displayed total.
3. Per-hour Stripe fixed fee ($0.30) as shown. If Stripe is charged per
   booking rather than per hour, the fixed fee should be amortised or moved
   to the booking total; the config makes this a one-line change.

## Licence

MIT (see LICENSE).

## AI disclosure

This demo was drafted with the assistance of a generative AI tool (Muse, by
Meta). Every output was checked by the developer: the calculation is pinned
by automated tests to the brief's worked example, and the code was reviewed
line by line.
