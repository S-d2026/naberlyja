import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Naberly",
  description: "Your Naberhood at your fingertips.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: 12,
            paddingBottom: 90,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <Link href="/" className="btn secondary" style={{ width: "auto" }}>
              Home
            </Link>

            <Link href="/login" className="btn secondary" style={{ width: "auto" }}>
              Login
            </Link>

            <Link href="/signup" className="btn secondary" style={{ width: "auto" }}>
              Sign Up
            </Link>

            <Link href="/post" className="btn" style={{ width: "auto" }}>
              Post
            </Link>

            <Link href="/favorites" className="btn secondary" style={{ width: "auto" }}>
              Saved
            </Link>
          </div>

          {children}
        </div>
      </body>
    </html>
  );
}