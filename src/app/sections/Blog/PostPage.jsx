import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { parseISO, format } from "date-fns";
import CategoryLabel from "@/components/blog/category";
import markdownit from "markdown-it";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/ui/code-block";
import React from "react";
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

        <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug break-words hyphens-none">
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
                {post?.author?.name && (
                  <Link href={`#`}>{post.author.name}</Link>
                )}
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
          className="prose max-w-screen-xl break-words dark:prose-invert"
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-4xl font-bold my-4 uppercase break-words hyphens-none" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-3xl font-semibold my-3 break-words hyphens-none" {...props} />
            ),
            p: ({ node, children, ...props }) => {
              // Check if the paragraph contains only a code block
              const hasOnlyCodeBlock = React.Children.toArray(children).every(
                child => React.isValidElement(child) && child.type === 'code' && !child.props.inline
              );
              
              if (hasOnlyCodeBlock) {
                // If it's just a code block, don't wrap it in a p tag
                return <>{children}</>;
              }
              
              return (
                <p className="text-gray-700 dark:text-gray-300 my-2 break-words hyphens-none" {...props}>
                  {children}
                </p>
              );
            },
            h3: ({ node, ...props }) => (
              <h3 className="text-2xl font-semibold my-2 break-words hyphens-none" {...props} />
            ),
            h4: ({ node, ...props }) => (
              <h4 className="text-xl font-semibold my-2 break-words hyphens-none" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-outside my-3 ml-6 space-y-2" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-outside my-3 ml-6 space-y-2" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="break-words hyphens-none pl-2 text-gray-700 dark:text-gray-300" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-gray-500 pl-4 italic text-gray-600 dark:text-gray-300 break-words hyphens-none"
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
            a: ({ node, href, children, ...props }) => {
              // Ensure href is always a valid string (handle null, undefined, empty string)
              const validHref = (href && typeof href === 'string' && href.trim() !== '') ? href : '#';
              
              // Check if it's an external link
              const isExternal = validHref.startsWith('http://') || 
                                validHref.startsWith('https://') || 
                                validHref.startsWith('//') ||
                                validHref.startsWith('mailto:') ||
                                validHref.startsWith('tel:');
              
              if (isExternal) {
                return (
                  <a
                    href={validHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    {...props}
                  >
                    {children}
                  </a>
                );
              }
              
              // For internal links, ensure href is a string
              const internalHref = typeof validHref === 'string' ? validHref : '#';
              
              return (
                <Link
                  href={internalHref}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  {...props}
                >
                  {children}
                </Link>
              );
            },
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              
              if (inline) {
                return (
                  <code
                    className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              
              // For block code, return the CodeBlock directly
              return (
                <CodeBlock language={language}>
                  {String(children).replace(/\n$/, '')}
                </CodeBlock>
              );
            },
          }}
        >
          {post.pitch}
        </ReactMarkdown>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition-all"
          >
            Back to Posts
          </Link>
        </div>
      </section>
    </>
  );
}

