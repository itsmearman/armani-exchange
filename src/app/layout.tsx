import type { Metadata } from "next";
import Layout from "@/src/view/layouts/layout";

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
    <Layout>
      {children}
    </Layout>
  );
}
