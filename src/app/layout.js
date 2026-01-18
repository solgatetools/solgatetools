import "./globals.css";
import { JetBrains_Mono, Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata = {
  title: "Pulse402 - Usage -> Buybacks",
  description:
    "Pulse402 is a simple HTTP 402 payment wrapper that adds a programmable fee routed to buybacks for any project token."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
