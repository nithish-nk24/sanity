import * as React from "react";

import { SidebarOptInForm } from "@/components/sidebar-opt-in-form";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from '@/app/favicon.ico'
import Link from "next/link";
import { Button } from "./ui/button";
import { BookmarkPlus, Library } from "lucide-react";
import Image from "next/image";

// This is sample data.
const data = {
  navMain: [
    {
      title: "All Blogs",
      url: "/admin/dashboard",
      icon:<Library />
    },
    {
      title: "Create Blog",
      url: "/admin/createblog",
      icon:<BookmarkPlus />
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="max-sm:bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image width={20} height={20} src={Logo} alt="logo" className="w-6 h-6"/>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Cyfotok Adacemy</span>
                  <span className="">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="max-sm:bg-white">
        <ul className="flex flex-col gap-y-1 ">
          {data.navMain.map((link, index) => (
            <li key={index} className="p-1">
              <Link href={link.url}>
                <Button className="w-full flex gap-2 items-start">
                  {link.title} {link.icon}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </SidebarContent>
      <SidebarFooter className="max-sm:bg-white">
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
