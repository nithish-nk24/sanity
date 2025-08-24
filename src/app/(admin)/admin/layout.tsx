import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import 'easymde/dist/easymde.min.css';
import { ThemeProvider } from "@/lib/theme";
import { AdminNavigation } from "@/components/admin-components/AdminNavigation";
import { SessionProvider } from "next-auth/react";

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
    <html lang="en">
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
