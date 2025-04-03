import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Blog } from "@/lib/types";

type BlogsListProps = {
  blogsData: Blog;
};

const BlogsList = ({ blogsData }: BlogsListProps) => {
  return (
    <section className="my-10 px-3 ">
      <div className="bg-gradient-to-t from-pink-500 to-rose-500 rounded-lg p-5 max-md:px-3">
        <h2 className="text-5xl font-semibold text-white text-center my-3 max-md:text-3xl">Latest Blogs</h2>
        <HoverEffect items={blogsData} className="p-0"/>
      </div>
    </section>
  );
};

export default BlogsList;
