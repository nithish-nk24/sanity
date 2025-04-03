import { Blog, BlogData } from "@/lib/types";
import Image from "next/image";
import BlogDescription from "./BlogDescription";

type BlogHeroProps = {
  blogData: BlogData;
};

const BlogHero = ({ blogData }: BlogHeroProps) => {
  return (
    <section className="my-10">
      <div className="min-h-[300px] bg-gradient-to-r from-blue-200 to-rose-200 rounded-lg  flex justify-center items-center ">
        <h2 className="text-5xl text-center font-semibold  bg-black/80 px-4 py-3  text-white max-md:text-2xl">
          {blogData.title}
        </h2>
      </div>
      <div className="flex justify-center items-center mt-[-50px] max-w-[900px] mx-auto max-md:w-[350px]">
        <Image
          src={blogData.imageSrc}
          alt={blogData.title}
          width={720}
          height={1080}
          className="border-2 border-black/60"
        />
      </div>
      <hr className="my-5" />
      {blogData.para?.map((para, index) => (
        <BlogDescription key={index} code={para.code} heading={para.heading} subheading={para.subheading} text={para.text} />
      ))}
    </section>
  );
};

export default BlogHero;
