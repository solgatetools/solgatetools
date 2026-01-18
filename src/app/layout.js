import "./globals.css";
import { JetBrains_Mono, Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "SolGate — Usage → Buybacks",
  description:
    "SolGate is a programmable HTTP 402 payment layer that routes usage fees into automated buybacks, turning real usage into buy pressure.",
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
