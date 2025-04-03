import { auth } from "@/auth";
import {
  BentoGrid,
  BentoGridItem,
} from "@/components/admin-components/bento-grid";
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
import { BLOGS_QUERY } from "@/sanity/lib/queries";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
}[]
export default async function Page() {
  const session = await auth();
  // console.log(session);
  if (!session) redirect("/");

  const blogs:blogTypeProp = await client.fetch(BLOGS_QUERY);
  // console.log(blogs);

  //delete Function 
  const handleDelete = async(id:string)=>{
    'use server'
    await deleteBlog(id)
    revalidatePath('/admin/dashboard')
  }
  return (
    <>
      {session && (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
              <BentoGrid>
                {blogs.map((blog, i) => (
                  <BentoGridItem
                    title={blog.title}
                    key={i}
                    id={blog._id}
                    description={blog.description}
                    image={blog.image}
                    author={blog.author.name}
                    authorImg= {blog.author.image}
                    onDelete={handleDelete}
                    className={`bg-pink-100/80 text-black p-2 rounded-lg hover:scale-100 scale-95 duration-300 transition`}
                  />
                ))}
              </BentoGrid>
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}
