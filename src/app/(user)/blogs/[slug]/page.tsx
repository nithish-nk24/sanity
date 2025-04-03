import PagePath from "@/components/page-path";
// import BlogsHero from "@/app/sections/Blogs/BlogsHero";
// import BlogsList from "@/app/sections/Blogs/BlogsList";
import { Metadata } from "next";
import { Suspense } from "react";
// import { blogs } from "../../../../../public/assets/blog";
import Loading from "../../loading";
import { client } from "@/sanity/lib/client";
import { BLOGS_QUERY } from "@/sanity/lib/queries";
import HomePage from "@/app/sections/Blogs/home";

type Props = {
  params: {
    slug: string;
  };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  return {
    title:
      slug === "all"
        ? "All Blogs - Cyfotok Academy"
        : `Blog | Reading - Cyfotok Academy`,
  };
}
const BlogsPage = async () => {
  // const blogsData = blogs.sort((a, b) => a.date.localeCompare(b.date));
  // console.log(blogs);

  const blogs = await client.fetch(BLOGS_QUERY);

  // console.log(JSON.stringify(blogs, null, 2));

  return (
    <main className="mt-28 mx-6 max-md:mx-3">
      <PagePath param={"All Blogs"} route="Blogs" />
      {/* najas nazar code  */}
      {/* <BlogsHero /> */}

      <Suspense fallback={<Loading />}>
        {/* <BlogsList blogsData={blogsData} /> */}
        <HomePage posts={blogs} />
      </Suspense>
    </main>
  );
};

export default BlogsPage;
