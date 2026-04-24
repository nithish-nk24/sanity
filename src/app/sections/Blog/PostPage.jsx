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
import { ArrowLeft, CalendarDays, Timer } from "lucide-react";
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
  const wordCount = post?.pitch ? String(post.pitch).trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(wordCount > 0 ? 1 : 0, Math.ceil(wordCount / 200));

  return (
    <>
      {/* Shell */}
      <div className="relative">
        {/* background */}
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-blue-50 via-purple-50 to-transparent dark:from-blue-950/30 dark:via-purple-950/30 pointer-events-none" />

        {/* Header Section */}
        <header className="mx-auto max-w-5xl px-6 md:px-8 lg:px-12 pt-10 pb-6 relative">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/blogs/all"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to blogs
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <CategoryLabel categories={post.category} />
          </div>

          <h1 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-foreground lg:text-5xl lg:leading-tight break-words hyphens-none">
            {post.title}
          </h1>

          {post?.description && (
            <p className="mx-auto mt-4 max-w-3xl text-center text-base md:text-lg text-muted-foreground leading-relaxed">
              {post.description}
            </p>
          )}

          <div className="mt-7 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted">
                {AuthorimageProps ? (
                  <Image
                    src={AuthorimageProps}
                    alt={post?.author?.name}
                    className="object-cover"
                    fill
                    sizes="48px"
                  />
                ) : null}
              </div>
              <div className="text-center sm:text-left">
                {post?.author?.name && (
                  <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
                )}
                <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    <time dateTime={post?.publishedAt || post._createdAt}>
                      {format(
                        parseISO(post?.publishedAt || post._createdAt),
                        "MMMM dd, yyyy"
                      )}
                    </time>
                  </span>
                  {readingTime > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <Timer className="h-4 w-4" />
                      {readingTime} min read
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <article className="max-w-5xl mx-auto px-6 md:px-8 lg:px-12 pb-20 relative">
        {/* Image Section */}
        {imageProps && (
          <div className="relative mx-auto aspect-video max-w-5xl overflow-hidden rounded-3xl shadow-2xl border border-border/60 mb-12">
            <Image
              src={imageProps}
              alt={post.image?.alt || "Thumbnail"}
              loading="eager"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Markdown Content */}
        <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-7 prose-a:font-medium prose-a:underline prose-a:underline-offset-4 prose-a:decoration-blue-300 dark:prose-a:decoration-blue-500 prose-hr:border-border/60">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-4xl font-bold mt-12 mb-6 first:mt-0 break-words hyphens-none text-gray-900 dark:text-gray-100 leading-tight" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-3xl font-semibold mt-10 mb-5 break-words hyphens-none text-gray-900 dark:text-gray-100 leading-tight border-b border-gray-200 dark:border-gray-800 pb-2" {...props} />
            ),
            p: ({ node, children, ...props }) => {
              const childrenArray = React.Children.toArray(children);

              // If the paragraph contains a fenced-code node that we're rendering as CodeBlock,
              // don't wrap it in <p> (prevents invalid <p><code><div> nesting).
              const hasBlockCode = childrenArray.some((child) => {
                if (!React.isValidElement(child)) return false;
                if (child.type !== "code") return false;
                const cls = child.props?.className;
                // fenced code blocks carry a language- className in react-markdown
                return typeof cls === "string" && cls.includes("language-");
              });

              if (hasBlockCode) return <>{children}</>;

              return (
                <p
                  className="text-gray-700 dark:text-gray-300 my-6 leading-7 break-words hyphens-none text-base"
                  {...props}
                >
                  {children}
                </p>
              );
            },
            // Unwrap <pre> so block code isn't forced inside it.
            // We render fenced blocks in the `code` renderer instead.
            pre: ({ node, children }) => <>{children}</>,
            h3: ({ node, children, ...props }) => {
              // Check if heading contains emoji (like 🔎) for special styling
              const headingText = typeof children === 'string' ? children : 
                React.Children.toArray(children).join('');
              const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(headingText);
              
              return (
                <h3 className={`text-2xl font-semibold mt-8 mb-4 break-words hyphens-none text-gray-900 dark:text-gray-100 leading-tight ${hasEmoji ? 'flex items-center gap-2' : ''}`} {...props} />
              );
            },
            h4: ({ node, ...props }) => (
              <h4 className="text-xl font-semibold mt-6 mb-3 break-words hyphens-none text-gray-900 dark:text-gray-100 leading-tight" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-outside my-6 ml-8 space-y-3 marker:text-blue-600 dark:marker:text-blue-400" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-outside my-6 ml-8 space-y-4 marker:text-blue-600 dark:marker:text-blue-400 marker:font-semibold" {...props} />
            ),
            li: ({ node, children, ...props }) => {
              // Check if list item contains code blocks or other block elements
              const childrenArray = React.Children.toArray(children);
              const hasBlockElements = childrenArray.some(
                child => React.isValidElement(child) && 
                (child.type === 'pre' || child.type?.name === 'CodeBlock' || 
                 (typeof child.type === 'string' && ['p', 'div', 'ul', 'ol'].includes(child.type)))
              );
              
              return (
                <li className={`break-words hyphens-none pl-4 text-gray-700 dark:text-gray-300 leading-7 ${hasBlockElements ? 'my-4 space-y-3' : ''}`} {...props}>
                  {children}
                </li>
              );
            },
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-blue-500 dark:border-blue-400 pl-6 py-2 my-6 italic text-gray-700 dark:text-gray-300 break-words hyphens-none bg-blue-50 dark:bg-blue-950/20 rounded-r-lg"
                {...props}
              />
            ),
            img: ({ node, ...props }) => (
              <div className="flex justify-center my-8">
                <Image
                  {...props}
                  className="rounded-xl shadow-xl border border-gray-200 dark:border-gray-800"
                  width={800}
                  height={500}
                  alt={props.alt || "Image"}
                />
              </div>
            ),
            a: ({ node, href, children, ...props }) => {
              // Ensure href is always a valid string (handle null, undefined, empty string, objects, etc.)
              let validHref = '#';
              
              if (href) {
                if (typeof href === 'string' && href.trim() !== '') {
                  validHref = href.trim();
                } else if (typeof href === 'object' && href !== null) {
                  // Handle Next.js Link object format if needed
                  validHref = '#';
                }
              }
              
              // Remove href from props to avoid conflicts
              const { href: _, ...restProps } = props;
              
              // Check if it's an external link
              const isExternal = validHref !== '#' && (
                validHref.startsWith('http://') || 
                validHref.startsWith('https://') || 
                validHref.startsWith('//') ||
                validHref.startsWith('mailto:') ||
                validHref.startsWith('tel:')
              );
              
              if (isExternal) {
                return (
                  <a
                    href={validHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-colors font-medium"
                    {...restProps}
                  >
                    {children}
                  </a>
                );
              }
              
              // For internal links, use Next.js Link with guaranteed string href
              return (
                <Link
                  href={validHref}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-colors font-medium"
                  {...restProps}
                >
                  {children}
                </Link>
              );
            },
            code: ({ node, inline, className, children, ...props }) => {
              const text = String(children ?? "");
              const hasFenceLanguage = typeof className === "string" && className.includes("language-");
              const looksLikeBlock = hasFenceLanguage || text.includes("\n");

              // Inline-ish code (even if react-markdown marks it as non-inline in some malformed markdown cases)
              if (inline || !looksLikeBlock) {
                return (
                  <code
                    className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              // Fenced code blocks
              const match = /language-([\w-]+)/.exec(className || "");
              const language = match ? match[1] : "";
              const codeText = text.replace(/\n$/, "");
              return <CodeBlock language={language}>{codeText}</CodeBlock>;
            },
            table: ({ node, ...props }) => (
              <div className="my-8 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" {...props} />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
            ),
            tbody: ({ node, ...props }) => (
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props} />
            ),
            tr: ({ node, ...props }) => (
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 break-words" {...props} />
            ),
          }}
        >
          {post.pitch}
        </ReactMarkdown>
        </div>

        {/* Back Button */}
        <div className="mt-16 pt-10 border-t border-border/60 text-center">
          <Link
            href="/blogs/all"
            className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3 rounded-full text-sm md:text-base font-semibold shadow-lg hover:opacity-90 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blogs
          </Link>
        </div>
      </article>
      </div>
    </>
  );
}

