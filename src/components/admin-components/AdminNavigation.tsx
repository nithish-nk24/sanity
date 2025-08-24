"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, LogIn } from "lucide-react";

export function AdminNavigation() {
  const pathname = usePathname();
  
  const isLoginPage = pathname === "/admin";


  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="flex items-center space-x-2">
            <Lock className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Cyfotok Admin
            </span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {!isLoginPage && (
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
          

          
          <Link href="/">
            <Button variant="ghost" size="sm">
              Back to Site
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
