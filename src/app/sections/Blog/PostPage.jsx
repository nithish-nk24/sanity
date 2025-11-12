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
      {/* Header Section */}
      <div className="mx-auto max-w-4xl px-6 md:px-8 lg:px-12 pt-8 pb-6">
        <div className="flex justify-center mb-4">
          <CategoryLabel categories={post.category} />
        </div>

        <h1 className="text-brand-primary mb-4 mt-2 text-center text-3xl font-bold tracking-tight dark:text-white lg:text-5xl lg:leading-tight break-words hyphens-none">
          {post.title}
        </h1>

        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 flex-shrink-0">
              {AuthorimageProps && (
                <Link href={"#"}>
                  <Image
                    src={AuthorimageProps}
                    alt={post?.author?.name}
                    className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                    fill
                    sizes="48px"
                  />
                </Link>
              )}
            </div>
            <div>
              <p className="text-gray-800 dark:text-gray-300 font-medium">
                {post?.author?.name && (
                  <Link href={`#`} className="hover:underline">{post.author.name}</Link>
                )}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <time
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

      {/* Content Section */}
      <article className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 pb-16">
        {/* Image Section */}
        {imageProps && (
          <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 mb-12 transition-transform duration-300 hover:scale-[1.01]">
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
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-7 prose-a:font-medium">
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
              // Check if the paragraph contains a pre element (which contains code blocks)
              const childrenArray = React.Children.toArray(children);
              const hasPreElement = childrenArray.some(
                child => React.isValidElement(child) && child.type === 'pre'
              );
              
              // If it contains a pre element, don't wrap it in a p tag
              if (hasPreElement) {
                return <>{children}</>;
              }
              
              // Check if the paragraph contains only a code block (CodeBlock component)
              const hasOnlyCodeBlock = childrenArray.some(
                child => React.isValidElement(child) && child.type?.name === 'CodeBlock'
              );
              
              if (hasOnlyCodeBlock) {
                // If it's just a code block, don't wrap it in a p tag
                return <>{children}</>;
              }
              
              return (
                <p className="text-gray-700 dark:text-gray-300 my-6 leading-7 break-words hyphens-none text-base" {...props}>
                  {children}
                </p>
              );
            },
            pre: ({ node, children, ...props }) => {
              // Extract code element from pre
              const codeElement = React.Children.toArray(children).find(
                child => React.isValidElement(child) && child.type === 'code'
              );
              
              if (codeElement) {
                // Get the code element's props
                const codeProps = codeElement.props;
                const className = codeProps.className || '';
                const match = /language-(\w+)/.exec(className);
                const language = match ? match[1] : '';
                
                // Return CodeBlock directly instead of wrapping in pre
                return (
                  <CodeBlock language={language}>
                    {String(codeProps.children).replace(/\n$/, '')}
                  </CodeBlock>
                );
              }
              
              // Fallback to default pre rendering
              return <pre {...props}>{children}</pre>;
            },
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
              // Only handle inline code here
              // Block code is handled by the pre component
              if (inline) {
                return (
                  <code
                    className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              
              // For block code, return the code element as-is (will be handled by pre component)
              return <code className={className} {...props}>{children}</code>;
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
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg text-base font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200"
          >
            ← Back to Posts
          </Link>
        </div>
      </article>
    </>
  );
}

