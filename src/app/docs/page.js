"use client";

import { useEffect } from "react";

const paymentSplitCode = `// Payment split math (example)
basePrice = 0.01 USDC
feeBps    = 50        // 0.50%
fee       = basePrice * (feeBps / 10_000) = 0.00005 USDC
merchant  = basePrice - fee = 0.00995 USDC`;

const installCode = `npm i solgate
# or
pnpm add solgate`;

const usageCode = `import express from "express";
import { solgate } from "solgate";

const app = express();

app.get(
  "/api/pro",
  solgate({
    merchant: {
      address: "MERCHANT_WALLET",
      priceUSDC: 0.01
    },
    fee: {
      bps: 50, // 0.50%
      destination: "BUYBACK_VAULT_WALLET"
    },
    buybackTarget: {
      chain: "solana",
      tokenMint: "TARGET_TOKEN_MINT",
      mode: "burn" // or "treasury"
    }
  }),
  async (req, res) => {
    res.json({ ok: true, data: "premium response" });
  }
);

app.listen(8787, () => console.log("SolGate server on :8787"));`;

const configCode = `type SolGateConfig = {
  merchant: {
    address: string;    // merchant destination address
    priceUSDC: number;  // base price per request
  };
  fee: {
    bps: number;        // basis points (e.g., 50 = 0.50%)
    destination: string;// buyback vault wallet address
  };
  buybackTarget?: {
    chain: "solana";
    tokenMint: string;  // token to buy back
    mode: "burn" | "treasury";
  };
  protocol?: {
    enabled: boolean;   // optional: take a small protocol fee
    bps: number;        // protocol fee bps
    destination: string;// protocol vault
    discounts?: {
      tokenMint: string;// $SG mint
      minBalance: number;
      discountedBps: number;
    };
  };
};`;

const vaultCode = `// buyback-bot pseudocode
// 1) read vault USDC balance
// 2) if balance > threshold:
//    - get swap route (e.g. Jupiter)
//    - execute swap
//    - send bought tokens to burn/treasury
// 3) log tx + update public stats page`;

export default function DocsPage() {
  useEffect(() => {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!revealItems.length) {
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("in-view"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, io) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-shell">
      <div className="bg-grid" aria-hidden="true"></div>

      <header className="site-header">
        <div className="container header-inner">
          <a className="logo" href="/">
            <div className="logo-mark" aria-hidden="true"></div>
            <div>
              <div>SolGate</div>
              <small>Usage -&gt; Buybacks</small>
            </div>
          </a>
          <nav className="nav">
            <a href="/docs">Docs</a>
            <div className="nav-icons">
              <a
                className="icon-button"
                href="https://x.com"
                target="_blank"
                rel="noopener"
                aria-label="X"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.9 2h3.6l-7.9 9 9.3 11h-7.3l-5.7-6.9L4.8 22H1.2l8.5-9.6L.8 2h7.5l5.1 6.2L18.9 2Zm-1.3 18h2L7.3 4H5.1l12.5 16Z" />
                </svg>
              </a>
              <a
                className="icon-button"
                href="https://github.com"
                target="_blank"
                rel="noopener"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-3 .7-3.6-1.3-3.6-1.3-.5-1.2-1.1-1.5-1.1-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.7 1 .1 1.5-.8 1.7-1.1.1-.7.4-1.1.7-1.4-2.4-.3-4.9-1.2-4.9-5.4 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.3 0c2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.4.1 2.7.7.8 1.1 1.8 1.1 3 0 4.2-2.5 5.1-4.9 5.4.4.3.7 1 .7 2v3c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main className="section">
        <div className="container">
          <div className="section-head" data-reveal>
            <h2>Documentation</h2>
            <p>Quickstart + configuration</p>
          </div>

          <div className="docs-grid">
            <nav className="toc" aria-label="Docs table of contents" data-reveal>
              <a href="#doc-what">What it is</a>
              <a href="#doc-flow">How the fee split works</a>
              <a href="#doc-install">Install</a>
              <a href="#doc-usage">Basic usage</a>
              <a href="#doc-config">Config reference</a>
              <a href="#doc-vault">Buyback vault (simple)</a>
              <a href="#doc-security">Security notes</a>
              <a href="#doc-faq">FAQ</a>
            </nav>

            <div className="stack">
              <article id="doc-what" className="doc-card" data-reveal>
                <h3>What is SolGate?</h3>
                <p>
                  SolGate is a tiny middleware that returns an
                  <strong> HTTP 402 Payment Required</strong> response when
                  payment is missing, and (when payment is present) it
                  <strong> splits</strong> the payment into merchant revenue +
                  buyback fee.
                </p>
                <div className="note">
                  <b>Core idea:</b> Do not tax transfers. Monetize usage and
                  route usage fees into buybacks.
                </div>
              </article>

              <article
                id="doc-flow"
                className="doc-card"
                data-reveal
                style={{ "--delay": "80ms" }}
              >
                <h3>How the fee split works</h3>
                <p>
                  On each paid request, SolGate calculates a fee in basis
                  points and routes it to a dedicated vault. The vault can
                  later swap accumulated funds into a target token (buyback)
                  and optionally burn or send to treasury.
                </p>
                <pre>
                  <code>{paymentSplitCode}</code>
                </pre>
              </article>

              <article
                id="doc-install"
                className="doc-card"
                data-reveal
                style={{ "--delay": "120ms" }}
              >
                <h3>Install</h3>
                <p>
                  In your server/app, install the middleware package. (Package
                  name is placeholder — replace once you publish.)
                </p>
                <pre>
                  <code>{installCode}</code>
                </pre>
              </article>

              <article
                id="doc-usage"
                className="doc-card"
                data-reveal
                style={{ "--delay": "160ms" }}
              >
                <h3>Basic usage (Node)</h3>
                <p>
                  Wrap your paid routes with <span className="tag">solgate()</span>.
                  If payment is missing, it responds with 402 and
                  instructions. If payment is valid, it forwards the request to
                  your handler.
                </p>
                <pre>
                  <code>{usageCode}</code>
                </pre>

                <div className="note warn">
                  <b>MVP tip:</b> keep it simple — accept payments in USDC
                  only, route fee to vault, and run buybacks on a schedule.
                </div>
              </article>

              <article
                id="doc-config"
                className="doc-card"
                data-reveal
                style={{ "--delay": "200ms" }}
              >
                <h3>Config reference</h3>
                <p>Minimal config you need to run SolGate.</p>
                <pre>
                  <code>{configCode}</code>
                </pre>
              </article>

              <article
                id="doc-vault"
                className="doc-card"
                data-reveal
                style={{ "--delay": "240ms" }}
              >
                <h3>Buyback vault (simple approach)</h3>
                <p>
                  Start with a simple off-chain buyback bot: it checks the
                  vault balance every X minutes and swaps USDC -&gt; target
                  token. Then it sends tokens to a burn address or a treasury
                  wallet.
                </p>
                <pre>
                  <code>{vaultCode}</code>
                </pre>
                <div className="note">
                  <b>Why this is good for MVP:</b> no custom program needed,
                  easier audits, you can ship fast. You can upgrade to a fully
                  on-chain vault later.
                </div>
              </article>

              <article
                id="doc-security"
                className="doc-card"
                data-reveal
                style={{ "--delay": "280ms" }}
              >
                <h3>Security notes</h3>
                <p>Keep the first version safe and boring:</p>
                <ul
                  style={{
                    margin: 0,
                    color: "var(--muted)",
                    lineHeight: 1.6,
                    fontSize: "13px",
                    paddingLeft: "18px",
                  }}
                >
                  <li>Use a dedicated vault wallet per project.</li>
                  <li>Log every buyback transaction publicly.</li>
                  <li>Set minimum swap thresholds to avoid dust swaps.</li>
                  <li>
                    Do not promise "guaranteed profits." Focus on fee routing
                    and transparency.
                  </li>
                </ul>
              </article>

              <article
                id="doc-faq"
                className="doc-card"
                data-reveal
                style={{ "--delay": "320ms" }}
              >
                <h3>FAQ</h3>
                <p>
                  <strong>Does this create sell pressure?</strong>
                  <br />
                  No transfer taxes. Fees come from paid usage, then can be
                  swapped into buybacks.
                </p>
                <p>
                  <strong>Can any project use it?</strong>
                  <br />
                  Yes. They set their vault + target token mint in config.
                </p>
                <p>
                  <strong>Do buybacks have to be automatic?</strong>
                  <br />
                  No. You can run scheduled buybacks or manual buybacks with
                  public receipts.
                </p>
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
