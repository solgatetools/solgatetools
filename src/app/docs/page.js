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

    // Smooth + stable scroll (fixes iOS hash jump weirdness)
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // Keep URL updated without triggering browser jump
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a className="logo" href="/">
            <div className="logo-mark" aria-hidden="true" />
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
              </nav>
            </aside>

            <div className="stack">
              <article id="what" className="doc-card">
                <h3>What is SolGate?</h3>
                <p>SolGate converts paid usage into programmable buybacks.</p>
              </article>

              <article id="flow" className="doc-card">
                <h3>Fee split</h3>
                <pre>
                  <code>{paymentSplitCode}</code>
                </pre>
              </article>

              <article id="install" className="doc-card">
                <h3>Install</h3>
                <pre>
                  <code>{installCode}</code>
                </pre>
              </article>

              <article id="usage" className="doc-card">
                <h3>Usage</h3>
                <pre>
                  <code>{usageCode}</code>
                </pre>
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
