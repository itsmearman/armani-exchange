import "@/src/app/globals.css";
import Navbar from "./navbar/navbar";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html>
        <body className=" font-IranSans">
            <Navbar/>
          {children}
        </body>
      </html>
    );
  }
  