import Logo from "../logo";
import { auth } from "@/auth";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { Plus, Settings, LogOut, User } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = async () => {
  const session = await auth();

  return (
    <>
      {session && (
        <nav className="bg-background/80 backdrop-blur-md border-b border-border/60 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
          <div className="flex items-center space-x-6">
            <Logo />
            <div className="hidden md:block h-6 w-px bg-border" />
            <div className="hidden md:flex items-center space-x-1">
              <span className="text-sm text-muted-foreground">Admin Panel</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              <ThemeToggle />
              <Button size="sm" variant="outline" asChild>
                <Link href="/admin/dashboard/createBlog">
                  <Plus className="h-4 w-4 mr-2" />
                  New Blog
                </Link>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link href="/admin/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={session?.user?.image || ""}
                        alt={session?.user?.name || ""}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {session?.user?.name?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">{session?.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
