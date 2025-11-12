'use client'
import React from 'react';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: string;
  className?: string;
  language?: string;
}

export function CodeBlock({ children, className, language }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 dark:border-zinc-700 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 dark:border-zinc-700 bg-zinc-900 dark:bg-zinc-950">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        {language && (
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide px-2 py-1 bg-zinc-800 dark:bg-zinc-800 rounded">{language}</span>
        )}
        <button
          onClick={onCopy}
          className="text-zinc-400 hover:text-zinc-200 transition-colors p-1.5 hover:bg-zinc-800 rounded"
          type="button"
          aria-label="Copy code"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      <div className="p-5 overflow-x-auto">
        <pre className={cn(
          "text-sm text-zinc-100 bg-transparent m-0 font-mono leading-relaxed",
          className
        )}>
          <code className="block whitespace-pre">{children}</code>
        </pre>
      </div>
      {copied && (
        <div className="absolute top-3 right-16 text-xs font-medium text-green-400 bg-green-950/50 px-2 py-1 rounded">
          Copied!
        </div>
      )}
    </div>
  );
}