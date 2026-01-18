"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const contractRef = useRef(null);
  const [copyLabel, setCopyLabel] = useState("Copy");

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

  const handleCopy = async () => {
    const value = contractRef.current?.value || "";
    if (!value) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        contractRef.current?.select();
        document.execCommand("copy");
      }
      setCopyLabel("Copied");
    } catch (error) {
      setCopyLabel("Press Ctrl+C");
    }

    window.setTimeout(() => {
      setCopyLabel("Copy");
    }, 1400);
  };

  return (
    <div className="app-shell">
      <div className="bg-grid" aria-hidden="true"></div>

      <header className="site-header">
        <div className="container header-inner">
          <a className="logo" href="#top">
            <div className="logo-mark" aria-hidden="true"></div>
            <div>
              <div>Pulse402</div>
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
                  <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-3 .7-3.6-1.3-3.6-1.3-.5-1.2-1.1-1.5-1.1-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.5-.8 1.7-1.1.1-.7.4-1.1.7-1.4-2.4-.3-4.9-1.2-4.9-5.4 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.3 0c2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.4.1 2.7.7.8 1.1 1.8 1.1 3 0 4.2-2.5 5.1-4.9 5.4.4.3.7 1 .7 2v3c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div className="panel" data-reveal>
              <div className="panel-inner">
                <span className="badge">
                  <span className="dot"></span> Protocol-ready 402
                </span>
                <h1>Programmable HTTP 402 payments with automatic buybacks.</h1>
                <p className="subtle">
                  Pulse402 is a minimal payment wrapper that adds a configurable
                  fee on every paid request. That fee routes into a buyback
                  vault for any token or project - turning usage into buy
                  pressure.
                </p>

                <div className="actions">
                  <a className="button primary" href="/docs">
                    Read the docs
                  </a>
                </div>

                <div className="tag-row">
                  <span className="tag">Zero transfer tax</span>
                  <span className="tag">Configurable basis points</span>
                  <span className="tag">Vault routing</span>
                  <span className="tag">Transparent receipts</span>
                </div>

                <p className="helper">
                  Built for builders: add one config, start collecting usage
                  fees, run buybacks on a schedule.
                </p>
              </div>
            </div>

            <aside
              id="token"
              className="panel"
              data-reveal
              style={{ "--delay": "120ms" }}
            >
              <div className="panel-inner">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ margin: 0 }}>$P402 Token</h3>
                    <div className="label">Ecosystem utility</div>
                  </div>
                  <span className="badge">Launching soon</span>
                </div>

                <div className="stat-grid" style={{ marginTop: "16px" }}>
                  <div className="stat">
                    <b>Utility</b>
                    <span>Fee discounts - verified badge - governance</span>
                  </div>
                  <div className="stat">
                    <b>Mechanic</b>
                    <span>Protocol fees -&gt; $P402 buybacks (optional)</span>
                  </div>
                </div>

                <div className="divider"></div>

                <span className="label">Contract address (CA)</span>
                <div className="copy-field">
                  <input
                    ref={contractRef}
                    value="PASTE_CA_HERE_AFTER_LAUNCH"
                    readOnly
                    onClick={(event) => event.currentTarget.select()}
                    aria-label="Contract address"
                  />
                  <button className="button small" type="button" onClick={handleCopy}>
                    {copyLabel}
                  </button>
                </div>

                <div className="divider"></div>

                <div className="note warn" data-reveal style={{ "--delay": "160ms" }}>
                  <b>Simple promise:</b> Pulse402 does not tax token transfers.
                  It adds a fee to revenue (paid requests), then routes that fee
                  to a vault that can buy back any token on a schedule.
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="usecases" className="section">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2>Use cases</h2>
              <p>Where Pulse402 shines</p>
            </div>

            <div className="grid-3">
              <div className="card" data-reveal style={{ "--delay": "60ms" }}>
                <h4>Paid APIs & Bots</h4>
                <p>
                  Charge <strong>HTTP 402</strong> per request. Route a small fee
                  to a buyback vault that accumulates USDC and swaps into your
                  token.
                </p>
              </div>
              <div className="card" data-reveal style={{ "--delay": "120ms" }}>
                <h4>Paywalled content</h4>
                <p>
                  Make premium endpoints (downloads, streams, tools) paid per
                  call. Every interaction becomes continuous buy pressure.
                </p>
              </div>
              <div className="card" data-reveal style={{ "--delay": "180ms" }}>
                <h4>Creator tools / SaaS</h4>
                <p>
                  Offer a free tier and a paid tier. The paid tier routes fees
                  into public buybacks that your community can track.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="socials" className="section">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2>Socials</h2>
              <p>Connect with Pulse402</p>
            </div>

            <footer className="footer">
              <div className="divider"></div>
              <div className="social-links" data-reveal style={{ "--delay": "80ms" }}>
                <a className="social-icon" href="https://x.com" target="_blank" rel="noopener" aria-label="X">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.9 2h3.6l-7.9 9 9.3 11h-7.3l-5.7-6.9L4.8 22H1.2l8.5-9.6L.8 2h7.5l5.1 6.2L18.9 2Zm-1.3 18h2L7.3 4H5.1l12.5 16Z" />
                  </svg>
                </a>
                <span className="social-sep" aria-hidden="true"></span>
                <a className="social-icon" href="https://github.com" target="_blank" rel="noopener" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-3 .7-3.6-1.3-3.6-1.3-.5-1.2-1.1-1.5-1.1-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.5-.8 1.7-1.1.1-.7.4-1.1.7-1.4-2.4-.3-4.9-1.2-4.9-5.4 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.3 0c2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.4.1 2.7.7.8 1.1 1.8 1.1 3 0 4.2-2.5 5.1-4.9 5.4.4.3.7 1 .7 2v3c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
                  </svg>
                </a>
                <span className="social-sep" aria-hidden="true"></span>
                <a className="social-icon" href="https://t.me" target="_blank" rel="noopener" aria-label="Telegram">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.6 4.4c.7-.3 1.4.3 1.2 1.1l-3 14.2c-.1.6-.8.9-1.3.6l-4.2-3.1-2 1.9c-.3.3-.9.2-1-.2l.5-4.6 7.7-7c.2-.2 0-.5-.3-.3l-9.5 6-4-1.3c-.7-.2-.7-1.2 0-1.5l16.1-5.8Z" />
                  </svg>
                </a>
                <span className="social-sep" aria-hidden="true"></span>
                <a className="social-icon" href="https://docs.pulse402.xyz" target="_blank" rel="noopener" aria-label="Docs">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 2h8l4 4v16H6V2Zm8 1.5V7h3.5L14 3.5ZM8.5 10h7v1.6h-7V10Zm0 4h7v1.6h-7V14Zm0 4h5.5v1.6H8.5V18Z" />
                  </svg>
                </a>
              </div>
              <div>
                <strong>Pulse402</strong> - Usage -&gt; Buybacks. Build real
                revenue, route real fees, publish real receipts.
              </div>
              <div style={{ marginTop: "8px" }}>
                Disclaimer: This site is informational and does not constitute
                financial advice. Token utility and mechanics may change.
              </div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
