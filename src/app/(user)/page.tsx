import { Metadata } from "next";
import { Suspense } from "react";
import Loading from "./loading";
import { client } from "@/sanity/lib/client";
import { BLOGS_QUERY } from "@/sanity/lib/queries";
import HomePage from "@/app/sections/Blogs/home";

export const metadata: Metadata = {
  title: "Cyfotok Academy - Blogs & Technology Education",
  description: "Explore the latest technology insights, tutorials, and educational content from Cyfotok Academy. Learn web development, cybersecurity, AI/ML, and more.",
};

const BlogsHomePage = async () => {
  const blogs = await client.fetch(BLOGS_QUERY);

  return (
    <main className="mt-16 mx-6 max-md:mx-3">
      <Suspense fallback={<Loading />}>
        <HomePage posts={blogs} />
      </Suspense>
    </main>
  );
};

export default BlogsHomePage;
