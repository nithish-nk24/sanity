import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { parseISO, format } from "date-fns";
import CategoryLabel from "@/components/blog/category";
import markdownit from "markdown-it";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const md = markdownit();
export default function Post(props) {
  const { loading, post } = props;
  // console.log(post);

  const slug = post?.slug;

  if (!loading && !slug) {
    notFound();
  }

  const imageProps = post?.image;
  const AuthorimageProps = post?.author?.image;
  const parsedContent = md.render(post?.pitch);

  return (
    <>
      <div className="mx-auto max-w-screen-md ">
        <div className="flex justify-center">
          <CategoryLabel categories={post.category} />
        </div>

        <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
          {post.title}
        </h1>

        <div className="mt-3 flex justify-center space-x-3 text-gray-500 ">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0">
              {AuthorimageProps && (
                <Link href={"#"}>
                  <Image
                    src={AuthorimageProps}
                    alt={post?.author?.name}
                    className="rounded-full object-cover"
                    fill
                    sizes="40px"
                  />
                </Link>
              )}
            </div>
            <div>
              <p className="text-gray-800 dark:text-gray-400">
                <Link href={`#`}>{post.author.name}</Link>
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <time
                  className="text-gray-500 dark:text-gray-400"
                  dateTime={post?.publishedAt || post._createdAt}
                >
                  {format(
                    parseISO(post?.publishedAt || post._createdAt),
                    "MMMM dd, yyyy"
                  )}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <section className="section_container">
        <div className="relative z-0 mx-auto aspect-video max-w-screen-lg overflow-hidden lg:rounded-lg my-10">
          {imageProps && (
            <Image
              src={imageProps}
              alt={post.mainImage?.alt || "Thumbnail"}
              loading="eager"
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>

        {parsedContent ? (
          <article
            className="prose max-w-4xl font-work-sans break-all"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        ) : (
          <p>No Details Provided</p>
        )}
      </section> */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
        {/* Image Section */}
        <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-2xl shadow-xl border border-gray-300 dark:border-gray-700 transition-transform duration-500 hover:scale-105">
          {imageProps && (
            <Image
              src={imageProps}
              alt={post.image?.alt || "Thumbnail"}
              loading="eager"
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>

        <hr className="my-5" />
        <ReactMarkdown
          className="prose max-w-screen-xl  break-all dark:prose-invert"
          remarkPlugins={[remarkGfm]} // Enables tables, lists, and footnotes
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-4xl font-bold my-4 uppercase" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-3xl font-semibold my-3" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-gray-700 dark:text-gray-300 my-2" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside my-3" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside my-3" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-gray-500 pl-4 italic text-gray-600 dark:text-gray-300"
                {...props}
              />
            ),
            img: ({ node, ...props }) => (
              <div className="flex justify-center my-4">
                <Image
                  {...props}
                  className="rounded-lg shadow-lg"
                  width={600}
                  height={400}
                  alt={props.alt || "Image"}
                />
              </div>
            ),
            code: ({ node, inline, className, children, ...props }) => (
              <code
                className={`bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded ${className || ""}`}
                {...props}
              >
                {children}
              </code>
            ),
          }}
        >
          {post.pitch}
        </ReactMarkdown>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/blogs/all"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition-all"
          >
            Back to Posts
          </Link>
        </div>
      </section>
    </>
  );
}
