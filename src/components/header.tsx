"use client";
import Logo from "./logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../app/lib/utils";
import { motion } from "framer-motion";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { AlignJustify, X } from "lucide-react";
import { useEffect, useState } from "react";

const routes = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Course",
    path: "/courses/all",
  },
  {
    name: "Resources",
    path: "/resources/all",
  },
  {
    name: "Blogs",
    path: "/blogs/all",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const activePathName = usePathname();
  const [open, setOpen] = useState(false);
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navClassNames = isScrolled
    ? "bg-white/50 backdrop-blur-sm border-none"
    : "bg-transparent";

  return (
    <header
      className={`flex justify-between items-center border-b border-black/25 px-3 h-20 fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm max-w-screen-2xl mx-auto ${navClassNames}`}
    >
      <Logo />
      <div className="flex items-center gap-x-3">
        <Link
          href={`https://cyfotok.academy/courses`}
          target="_blank"
        >
          <RainbowButton className="hover:scale-105 transition duration-300 max-md:hidden">
            Explore More
          </RainbowButton>
        </Link>
        <Link
          href={`https://calendly.com/meet-cyfotok/demo-session`}
          target="_blank"
        >
          <RainbowButton className="hover:scale-105 transition duration-300 max-md:hidden">
            Book a Demo
          </RainbowButton>
        </Link>
      </div>
      <div className="hidden max-md:block">
        <AlignJustify
          className="h-6 w-6 cursor-pointer "
          onClick={() => setOpen(!open)}
        />
        {open && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              easings: [0.12, 0, 0.39, 0],
            }}
            className="absolute bg-gradient-to-t from-pink-500 to-rose-500 w-[200px] h-screen top-0 right-0 z-50"
            onClick={() => setOpen(!open)}
          >
            <X className="h-6 w-6 cursor-pointer absolute right-3 top-7 text-white" />
            <ul className="flex flex-col gap-y-6 text-lg h-full text-center font-semibold mt-20 text-white overflow-x-hidden">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                  ease: "easeInOut",
                  easings: [0.12, 0, 0.39, 0],
                }}
              >
                <Link
                  href={`https://cyfotok.academy/courses`}
                  target="_blank"
                >
                  <RainbowButton className="mx-5 text-sm hover:scale-105 transition duration-300 ">
                    Explore More
                  </RainbowButton>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                  ease: "easeInOut",
                  easings: [0.12, 0, 0.39, 0],
                }}
              >
                <Link
                  href={`https://calendly.com/meet-cyfotok/demo-session`}
                  target="_blank"
                >
                  <RainbowButton className="mx-5 text-sm hover:scale-105 transition duration-300 ">
                    Book a Demo
                  </RainbowButton>
                </Link>
              </motion.div>
            </ul>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
