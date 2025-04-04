import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import "easymde/dist/easymde.min.css";


import { Toaster } from "@/components/ui/toaster";
import Container from '../../components/container';
import Header from '@/components/header';


const figtree = Figtree({ subsets: ["latin"] });
// const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"] }); // Aadhi Told to me change a new font for poppins
export const metadata: Metadata = {
  title: "Cyfotok Academy",
  description: "Generated by create next app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-gray-100 text-black overflow-y-scroll ${figtree.className} `}
      >
        <Container>
          <Header/>
          {children}
          <SpeedInsights />
          <Toaster />
        </Container>
      </body>
    </html>
  );
}
