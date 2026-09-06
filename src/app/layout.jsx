import { Archivo, Abril_Fatface } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ 
  subsets: ["latin"],
  variable: "--font-archivo",
});

const abril = Abril_Fatface({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-abril",
});

export const metadata = {
  title: "Pixel Empire - Own a piece of the internet",
  description: "1,000,000 pixels. One digital world. Your territory.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${archivo.variable} ${abril.variable} font-sans bg-[#2F0F03] text-[#FFDDAC] antialiased overflow-x-hidden min-h-screen`}>
        {children}
      </body>
    </html>
  );
}