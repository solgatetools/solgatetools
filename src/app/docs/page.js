"use client";

import { useEffect, useRef, useState } from "react";

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
    }
  }),
  async (req, res) => {
    res.json({ ok: true });
  }
);`;

const configCode = `type SolGateConfig = {
  merchant: {
    address: string;     // merchant destination address
    priceUSDC: number;   // base price per request
  };
  fee: {
    bps: number;         // basis points (e.g. 50 = 0.50%)
    destination: string; // buyback vault / treasury address
  };
};

// Example
solgate({
  merchant: {
    address: "MERCHANT_WALLET",
    priceUSDC: 0.01
  },
  fee: {
    bps: 50,
    destination: "BUYBACK_VAULT_WALLET"
  }
});`;

const vaultCode = `// buyback-bot pseudocode
// 1) read vault USDC balance
// 2) if balance >= MIN_SWAP:
//    - swap USDC -> target token via DEX aggregator
//    - send bought tokens to burn/treasury
// 3) log tx hash + amount for receipts`;

export default function DocsPage() {
  const [tocOpen, setTocOpen] = useState(false);
  const tocShellRef = useRef(null);

  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("in-view"));
      return;
    }

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

  // Close TOC when tapping outside (mobile UX)
  useEffect(() => {
    if (!tocOpen) return;

    const onDown = (e) => {
      const el = tocShellRef.current;
      if (!el) return;
      if (!el.contains(e.target)) setTocOpen(false);
    };

    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [tocOpen]);

  // Close TOC on Escape
  useEffect(() => {
    if (!tocOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setTocOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [tocOpen]);

  const goTo = (id) => (e) => {
    e.preventDefault();
    setTocOpen(false);

    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="app-shell">
      <div className="bg-grid" aria-hidden="true"></div>

      <header className="site-header">
        <div className="container header-inner">
          <a className="logo" href="/">
            <div className="logo-mark" aria-hidden="true"></div>
            <div className="logo-text">
              <div>SolGate</div>
              <small className="subline">Usage → Buybacks</small>
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
            <aside
              ref={tocShellRef}
              className={`toc-shell ${tocOpen ? "open" : ""}`}
            >
              <button
                className="toc-toggle"
                type="button"
                aria-expanded={tocOpen}
                aria-controls="toc"
                onClick={() => setTocOpen((v) => !v)}
              >
                {tocOpen ? "Hide sections" : "Show sections"}
                <span className="toc-caret" aria-hidden="true" />
              </button>

              <nav className="toc" id="toc" aria-label="Table of contents">
                <a href="#what" onClick={goTo("what")}>
                  What it is
                </a>
                <a href="#flow" onClick={goTo("flow")}>
                  Fee split
                </a>
                <a href="#install" onClick={goTo("install")}>
                  Install
                </a>
                <a href="#usage" onClick={goTo("usage")}>
                  Usage
                </a>
                <a href="#config" onClick={goTo("config")}>
                  Config reference
                </a>
                <a href="#vault" onClick={goTo("vault")}>
                  Buyback vault
                </a>
                <a href="#security" onClick={goTo("security")}>
                  Security notes
                </a>
                <a href="#faq" onClick={goTo("faq")}>
                  FAQ
                </a>
              </nav>
            </aside>

            <div className="stack">
              <article id="what" className="doc-card" data-reveal>
                <h3>What is SolGate?</h3>
                <p>
                  SolGate is a minimal HTTP 402 payment layer. Add a configurable
                  fee on every paid request and route it into a buyback vault —
                  converting real usage into real buy pressure.
                </p>
              </article>

              <article id="flow" className="doc-card" data-reveal>
                <h3>Fee split</h3>
                <pre>
                  <code>{paymentSplitCode}</code>
                </pre>
              </article>

              <article id="install" className="doc-card" data-reveal>
                <h3>Install</h3>
                <pre>
                  <code>{installCode}</code>
                </pre>
              </article>

              <article id="usage" className="doc-card" data-reveal>
                <h3>Usage</h3>
                <pre>
                  <code>{usageCode}</code>
                </pre>
              </article>

              <article id="config" className="doc-card" data-reveal>
                <h3>Config reference</h3>
                <p>Minimal config you need to run SolGate.</p>
                <pre>
                  <code>{configCode}</code>
                </pre>
              </article>

              <article id="vault" className="doc-card" data-reveal>
                <h3>Buyback vault</h3>
                <p>
                  SolGate routes fee revenue to a vault address. Buybacks can be
                  run on a schedule (cron) or manually — publish receipts either
                  way.
                </p>
                <pre>
                  <code>{vaultCode}</code>
                </pre>
              </article>

              <article id="security" className="doc-card" data-reveal>
                <h3>Security notes</h3>
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
                  <li>Log every buyback transaction publicly (tx hash, amounts).</li>
                  <li>Set minimum swap thresholds to avoid dust swaps.</li>
                  <li>
                    Do not promise “guaranteed profits.” Focus on fee routing and
                    transparent receipts.
                  </li>
                </ul>
              </article>

              <article id="faq" className="doc-card" data-reveal>
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
                  Yes. They set their vault + fee parameters in config.
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
