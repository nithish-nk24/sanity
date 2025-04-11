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
    <div className="relative my-4 rounded-lg bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        {language && (
          <div className="text-sm text-zinc-400">{language}</div>
        )}
        <button
          onClick={onCopy}
          className="text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className={cn(
          "text-sm text-zinc-100 bg-transparent",
          className
        )}>
          <code>{children}</code>
        </pre>
      </div>
      {copied && (
        <div className="absolute top-2 right-12 text-sm text-green-400">
          Copied!
        </div>
      )}
    </div>
  );
}