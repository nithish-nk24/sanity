import { FlipWords } from "@/components/ui/flip-words";

const BlogsHero = () => {
  const words = ["better", "skills", "future", "career"];
  return (
    <section className="my-5 px-3">
      <div className="min-h-[274px] max-lg:min-h-[230px] max-sm:min-h-[150px] bg-cover bg-banner  w-full rounded-md text-center flex justify-center items-center p-3">
        <div className="flex flex-col gap-2 items-start  min-w-[550px] max-md:min-w-[300px] max-sm:min-w-[250px] bg-black/90 rounded-md p-3">
          <h2 className="text-7xl font-bold text-white/90 max-md:text-5xl max-sm:text-2xl">
            Build <FlipWords words={words} className="text-white/90" />
          </h2>

          <p className="text-3xl font-semibold text-white/70 max-sm:text-xs">
            With Cyfotok Academy Blogs
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogsHero;
