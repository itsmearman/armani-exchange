import "@/app/globals.css";
import Navbar from "./navbar/navbar";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html>
        <body>
            <Navbar/>
          {children}
        </body>
      </html>
    );
  }
  