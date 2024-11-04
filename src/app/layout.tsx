import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Armani Exchange",
  description: "Biggest Exchange in Asia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
