"use client";
// components/MdxProvider.js
import { MDXProvider } from "@mdx-js/react";

const components = {
  h1: (props) => <h1 className="text-3xl font-bold my-4" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold my-3" {...props} />,
  h3: (props) => <h2 className="text-2xl font-semibold my-3" {...props} />,
  p: (props) => (
    <p className="text-gray-700 dark:text-gray-300 my-2" {...props} />
  ),
  pre: (props) => (
    <pre
      className="bg-gray-900 text-white p-4 rounded-md overflow-auto"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded"
      {...props}
    />
  ),
};

export default function MdxProvider({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
