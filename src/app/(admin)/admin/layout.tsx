import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import 'easymde/dist/easymde.min.css';
import { ThemeProvider } from "@/lib/theme";
import { AdminNavigation } from "@/components/admin-components/AdminNavigation";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

export const metadata = {
  title: "Cyfotok Academy - Admin Dashboard",
  description: "Admin dashboard for managing blog content and platform settings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <SessionProvider>
            <AdminNavigation />
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
