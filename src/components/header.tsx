"use client";
import Logo from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../app/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { AlignJustify, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const routes = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Courses",
    path: "/courses/all",
    hasDropdown: true,
    subItems: [
      { name: "All Courses", path: "/courses/all" },
      { name: "Web Development", path: "/courses/web-development" },
      { name: "Data Science", path: "/courses/data-science" },
      { name: "AI & ML", path: "/courses/ai-ml" },
    ]
  },
  {
    name: "Internships",
    path: "/internships",
  },
  {
    name: "Careers",
    path: "/careers",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const activePathName = usePathname();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClassNames = isScrolled
    ? "bg-background/95 backdrop-blur-md border-border/50 shadow-lg"
    : "bg-background/80 backdrop-blur-sm border-border/30";

  const handleDropdownToggle = (routeName: string) => {
    setActiveDropdown(activeDropdown === routeName ? null : routeName);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClassNames} border-b border-border`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {routes.map((route) => (
              <div key={route.name} className="relative group">
                {route.hasDropdown ? (
                  <div className="relative">
                    <button
                      onClick={() => handleDropdownToggle(route.name)}
                                           className={cn(
                       "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                       "hover:bg-muted hover:text-blue-600",
                       activePathName.startsWith(route.path.split('/')[1]) && route.path !== '/'
                         ? "text-blue-600 bg-blue-50"
                         : activePathName === route.path
                         ? "text-blue-600 bg-blue-50"
                         : "text-foreground"
                     )}
                    >
                      {route.name}
                      <ChevronDown className={cn(
                        "ml-1 h-4 w-4 transition-transform duration-200",
                        activeDropdown === route.name ? "rotate-180" : ""
                      )} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {activeDropdown === route.name && (
                                                 <motion.div
                           initial={{ opacity: 0, y: -10, scale: 0.95 }}
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           exit={{ opacity: 0, y: -10, scale: 0.95 }}
                           transition={{ duration: 0.2 }}
                           className="absolute top-full left-0 mt-2 w-56 bg-background rounded-xl shadow-lg border border-border overflow-hidden"
                         >
                          {route.subItems?.map((subItem, index) => (
                                                         <Link
                               key={subItem.name}
                               href={subItem.path}
                               className="block px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-blue-600 transition-colors duration-150"
                               onClick={() => setActiveDropdown(null)}
                             >
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                {subItem.name}
                              </motion.div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                                     <Link
                     href={route.path}
                     className={cn(
                       "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                       "hover:bg-muted hover:text-blue-600",
                       activePathName === route.path
                         ? "text-blue-600 bg-blue-50"
                         : "text-foreground"
                     )}
                   >
                     {route.name}
                   </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
                         <Link
               href="https://cyfotok.academy/courses"
               target="_blank"
               className="px-4 py-2 text-sm font-medium text-foreground hover:text-blue-600 transition-colors duration-200"
             >
               Explore More
             </Link>
            <Link
              href="https://calendly.com/meet-cyfotok/demo-session"
              target="_blank"
            >
              <RainbowButton className="hover:scale-105 transition-transform duration-200">
                Book a Demo
              </RainbowButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
                     <div className="md:hidden">
             <button
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors duration-200"
             >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <AlignJustify className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/50 mt-1 rounded-b-xl shadow-lg overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {routes.map((route, index) => (
                  <motion.div
                    key={route.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {route.hasDropdown ? (
                      <div>
                                                 <button
                           onClick={() => handleDropdownToggle(route.name)}
                           className={cn(
                             "w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-medium transition-all duration-200",
                             "hover:bg-muted",
                             activePathName.startsWith(route.path.split('/')[1]) && route.path !== '/'
                               ? "text-blue-600 bg-blue-50"
                               : "text-foreground"
                           )}
                         >
                          {route.name}
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            activeDropdown === route.name ? "rotate-180" : ""
                          )} />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === route.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-4 mt-2 space-y-1 overflow-hidden"
                            >
                              {route.subItems?.map((subItem) => (
                                                                 <Link
                                   key={subItem.name}
                                   href={subItem.path}
                                   className="block px-4 py-2 text-sm text-muted-foreground hover:text-blue-600 hover:bg-muted rounded-lg transition-colors duration-150"
                                   onClick={() => {
                                     setIsMobileMenuOpen(false);
                                     setActiveDropdown(null);
                                   }}
                                 >
                                   {subItem.name}
                                 </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                                             <Link
                         href={route.path}
                         className={cn(
                           "block px-4 py-3 rounded-lg font-medium transition-all duration-200",
                           "hover:bg-muted",
                           activePathName === route.path
                             ? "text-blue-600 bg-blue-50"
                             : "text-foreground"
                         )}
                         onClick={() => setIsMobileMenuOpen(false)}
                       >
                         {route.name}
                       </Link>
                    )}
                  </motion.div>
                ))}

                {/* Mobile CTA Buttons */}
                <div className="pt-4 mt-4 border-t border-border space-y-3">
                  {/* Theme Toggle for Mobile */}
                  <div className="flex justify-center">
                    <ThemeToggle />
                  </div>
                                     <Link
                     href="https://cyfotok.academy/courses"
                     target="_blank"
                     className="block w-full text-center px-4 py-3 text-sm font-medium text-foreground hover:text-blue-600 hover:bg-muted rounded-lg transition-colors duration-200"
                     onClick={() => setIsMobileMenuOpen(false)}
                   >
                     Explore More
                   </Link>
                  <Link
                    href="https://calendly.com/meet-cyfotok/demo-session"
                    target="_blank"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <RainbowButton className="w-full justify-center">
                      Book a Demo
                    </RainbowButton>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close dropdowns */}
      {(activeDropdown || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setActiveDropdown(null);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
