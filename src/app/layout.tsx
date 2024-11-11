import Layout from "@/src/view/layouts/layout";

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
