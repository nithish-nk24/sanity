import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { deleteBlog } from "@/lib/action";
import { client } from "@/sanity/lib/client";
import { ADMIN_BLOGS_QUERY } from "@/sanity/lib/queries";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { 
  DashboardStats, 
  BlogManagement, 
  QuickActions, 
  AnalyticsOverview, 
  DashboardSkeleton 
} from "@/components/admin-components";
import { Suspense } from "react";

type blogTypeProp = {
  title: string;
  slug:{
    current: string
    _type: string
  },
  _createdAt: string;
  author: {
    name: string;
    image: string;
  };
  category: string;
  description: string;
  pitch: string;
  _id: string;
  link: string;
  image: string;
  published?: boolean;
}[]

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/");

  const blogs: blogTypeProp = await client.fetch(ADMIN_BLOGS_QUERY);

  // Calculate statistics
  const totalBlogs = blogs.length;
  const recentBlogs = blogs.slice(0, 5);
  const categories = [...new Set(blogs.map(blog => blog.category))];
  const totalCategories = categories.length;

  // Get current month blogs
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyBlogs = blogs.filter(blog => {
    const blogDate = new Date(blog._createdAt);
    return blogDate.getMonth() === currentMonth && blogDate.getFullYear() === currentYear;
  }).length;

  // Get previous month blogs
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const previousMonthBlogs = blogs.filter(blog => {
    const blogDate = new Date(blog._createdAt);
    return blogDate.getMonth() === previousMonth && blogDate.getFullYear() === previousYear;
  }).length;

  return (
    <>
      {session && (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sticky top-0 z-40">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            
            <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-background via-background/50 to-muted/30 dark:from-background dark:via-background/80 dark:to-muted/20">
              <Suspense fallback={<DashboardSkeleton />}>
                {/* Welcome Section */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Welcome back, {session.user?.name}!
                  </h1>
                  <p className="text-muted-foreground">
                    Here&apos;s what&apos;s happening with your blog platform today.
                  </p>
                </div>

                {/* Statistics Cards */}
                <DashboardStats 
                  totalBlogs={totalBlogs}
                  monthlyBlogs={monthlyBlogs}
                  totalCategories={totalCategories}
                  recentBlogs={recentBlogs}
                />

                {/* Analytics Overview */}
                <AnalyticsOverview 
                  totalBlogs={totalBlogs}
                  monthlyBlogs={monthlyBlogs}
                  previousMonthBlogs={previousMonthBlogs}
                  totalCategories={totalCategories}
                />

                {/* Quick Actions */}
                <QuickActions />

                {/* Blog Management */}
                <BlogManagement blogs={blogs} />
              </Suspense>
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}
