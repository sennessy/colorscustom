# Stripe New Account Checklist (Production)

Use this checklist when the new Stripe account is ready.

## 1) Stripe dashboard (Live mode)

- Complete account verification (identity + business details).
- Confirm payouts/bank account is active.
- Go to `Developers -> API keys` and copy:
  - `pk_live_...` (Publishable key)
  - `sk_live_...` (Secret key, click Reveal)

## 2) Webhook

- Create endpoint: `https://colorscustom.ch/stripe/webhook`
- Event: `checkout.session.completed`
- Copy signing secret: `whsec_...`

## 3) Render environment variables (service: `main`, Docker)

Set/update:

- `APP_BASE_URL=https://colorscustom.ch`
- `CHECKOUT_SIMULATION_ENABLED=false`
- `STRIPE_SECRET_KEY=sk_live_...`
- `STRIPE_PUBLIC_KEY=pk_live_...`
- `STRIPE_WEBHOOK_SECRET=whsec_...`
- `BANK_TRANSFER_ENABLED=true`
- `BANK_TRANSFER_RECIPIENT=Carlos Ferros Samuel`
- `BANK_TRANSFER_IBAN=CH0200788000051152283`

Important:

- Never use key IDs.
- No quotes.
- No leading/trailing spaces.
- `STRIPE_SECRET_KEY` must start with `sk_`.

## 4) Deploy

- Render -> `Manual Deploy` -> `Deploy latest commit`.

## 5) Validation

- Checkout from `https://colorscustom.ch/boutique` redirects to `checkout.stripe.com`.
- Stripe logs do not show `secret_key_required`.
- Webhook deliveries for `checkout.session.completed` return `200`.

