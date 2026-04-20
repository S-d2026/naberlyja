import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naberly JA",
  description: "What yuh need, near yuh.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <div className="flex between center gap-12" style={{ marginBottom: 16 }}>
            <Link href="/" style={{ fontWeight: 800, fontSize: 22 }}>Naberly JA</Link>
            <div className="flex gap-12 wrap small">
              <Link href="/login">Login</Link>
              <Link href="/signup">Sign Up</Link>
              <Link href="/post">Post</Link>
              <Link href="/favorites">Saved</Link>
              <Link href="/admin">Admin</Link>
              <Link href="/featured">Featured</Link>
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
