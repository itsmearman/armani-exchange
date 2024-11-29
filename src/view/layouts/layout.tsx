import "@/src/app/globals.css";
import Navbar from "./navbar/navbar";
import Footer from "./footer/footer";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html  lang={locale} >
      <body className="font-IranSans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
