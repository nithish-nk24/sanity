import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { CreateForm } from "@/components/create-form";
import {
  Breadcrumb,
  BreadcrumbItem,
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
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: { edit?: string };
}

export default async function Page({ searchParams }: PageProps) {
  const session = await auth();
  if (!session) redirect('/')

  const isEditMode = !!searchParams.edit;
  const blogId = searchParams.edit;

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
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {isEditMode ? 'Edit Blog' : 'Create Blog'}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col bg-gradient-to-br from-background via-background/50 to-muted/30 dark:from-background dark:via-background/80 dark:to-muted/20 min-h-screen">
              <CreateForm 
                className="p-6 max-w-5xl mx-auto w-full"
                isEditMode={isEditMode}
                blogId={blogId}
              />
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}
