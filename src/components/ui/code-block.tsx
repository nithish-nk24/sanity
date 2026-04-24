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
    <div className="relative my-4 rounded-xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 dark:border-zinc-700 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 dark:border-zinc-700 bg-zinc-900/80 dark:bg-zinc-950/80">
        <div className="min-w-0" />
        {language ? (
          <span className="text-[11px] font-medium text-zinc-300 uppercase tracking-wide px-2 py-0.5 bg-zinc-800/80 dark:bg-zinc-800/80 rounded">
            {language}
          </span>
        ) : (
          <span className="text-[11px] text-zinc-500">code</span>
        )}
        <button
          onClick={onCopy}
          className="text-zinc-300 hover:text-white transition-colors p-1.5 hover:bg-zinc-800/80 rounded"
          type="button"
          aria-label="Copy code"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className={cn(
          "text-sm text-zinc-100 bg-transparent m-0 font-mono leading-relaxed",
          className
        )}>
          <code className="block whitespace-pre">{children}</code>
        </pre>
      </div>
      {copied && (
        <div className="absolute top-2.5 right-14 text-xs font-medium text-green-400 bg-green-950/50 px-2 py-1 rounded">
          Copied!
        </div>
      )}
    </div>
  );
}