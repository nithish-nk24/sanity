import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import "easymde/dist/easymde.min.css";


import { Toaster } from "@/components/ui/toaster";
import Container from '../../components/container';
import Header from '@/components/header';
import Footer from '@/components/Footer';
import { ThemeProvider } from "@/lib/theme";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import Script from "next/script";


const figtree = Figtree({ subsets: ["latin"] });
// const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"] }); // Aadhi Told to me change a new font for poppins
export const metadata: Metadata = {
  metadataBase: new URL(
    (process.env.NEXT_PUBLIC_SITE_URL || "https://cyfotok.com").replace(/\/+$/, "")
  ),
  title: {
    default: "Cyfotok Academy",
    template: "%s | Cyfotok Academy",
  },
  description:
    "Explore technology insights, tutorials, and educational content from Cyfotok Academy.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Cyfotok Academy",
    url: "/",
    title: "Cyfotok Academy",
    description:
      "Explore technology insights, tutorials, and educational content from Cyfotok Academy.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@cyfotok",
    title: "Cyfotok Academy",
    description:
      "Explore technology insights, tutorials, and educational content from Cyfotok Academy.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{`(function () {
  try {
    var theme = localStorage.getItem("theme");
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var resolved = theme === "dark" || theme === "light" ? theme : (systemDark ? "dark" : "light");
    var root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
  } catch (e) {}
})();`}</Script>
      </head>
      <body
        className={`bg-background text-foreground overflow-y-scroll ${figtree.className}`}
      >
        <ThemeProvider>
          <Container>
            <Header/>
            {children}
            <Footer />
            <SpeedInsights />
            <GoogleAnalytics />
            <Toaster />
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
