"use client";

import { useEffect, useState } from "react";

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
      bps: 50,
      destination: "BUYBACK_VAULT_WALLET"
    },
    buybackTarget: {
      chain: "solana",
      tokenMint: "TARGET_TOKEN_MINT",
      mode: "burn"
    }
  }),
  async (req, res) => {
    res.json({ ok: true });
  }
);`;

export default function DocsPage() {
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a className="logo" href="/">
            <div className="logo-mark" />
            <div>
              <div>SolGate</div>
              <small>Usage → Buybacks</small>
            </div>
          </a>
        </div>
      </header>

      <main className="section">
        <div className="container">
          <div className="section-head">
            <h2>Documentation</h2>
            <p>Quickstart + configuration</p>
          </div>

          <div className="docs-grid">
            {/* MOBILE TOC */}
            <aside className={`toc-shell ${tocOpen ? "open" : ""}`}>
              <button
                className="toc-toggle"
                onClick={() => setTocOpen(!tocOpen)}
              >
                {tocOpen ? "Hide sections" : "Show sections"}
                <span className="toc-caret" />
              </button>

              <nav className="toc">
                <a href="#doc-what" onClick={() => setTocOpen(false)}>What it is</a>
                <a href="#doc-flow" onClick={() => setTocOpen(false)}>Fee split</a>
                <a href="#doc-install" onClick={() => setTocOpen(false)}>Install</a>
                <a href="#doc-usage" onClick={() => setTocOpen(false)}>Usage</a>
                <a href="#doc-config" onClick={() => setTocOpen(false)}>Config</a>
                <a href="#doc-faq" onClick={() => setTocOpen(false)}>FAQ</a>
              </nav>
            </aside>

            <div className="stack">
              <article id="doc-what" className="doc-card">
                <h3>What is SolGate?</h3>
                <p>SolGate is a programmable HTTP 402 payment layer.</p>
              </article>

              <article id="doc-flow" className="doc-card">
                <h3>How the fee split works</h3>
                <pre><code>{paymentSplitCode}</code></pre>
              </article>

              <article id="doc-install" className="doc-card">
                <h3>Install</h3>
                <pre><code>{installCode}</code></pre>
              </article>

              <article id="doc-usage" className="doc-card">
                <h3>Basic usage</h3>
                <pre><code>{usageCode}</code></pre>
              </article>

              <article id="doc-faq" className="doc-card">
                <h3>FAQ</h3>
                <p>No transfer taxes. Fees come from usage.</p>
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
