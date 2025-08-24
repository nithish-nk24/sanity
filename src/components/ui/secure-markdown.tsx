"use client";

import React, { useMemo } from 'react';
import { sanitizeMarkdown, sanitizeMarkdownForBlog, sanitizeMarkdownForComments } from '@/lib/markdown-sanitizer';

export interface SecureMarkdownProps {
  content: string;
  variant?: 'default' | 'blog' | 'comment' | 'admin';
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  showSanitizationStats?: boolean;
}

export const SecureMarkdown: React.FC<SecureMarkdownProps> = ({
  content,
  variant = 'default',
  className = '',
  allowedTags,
  allowedAttributes,
  showSanitizationStats = false
}) => {
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    
    let sanitized: string;
    
    switch (variant) {
      case 'blog':
        sanitized = sanitizeMarkdownForBlog(content);
        break;
      case 'comment':
        sanitized = sanitizeMarkdownForComments(content);
        break;
      case 'admin':
        sanitized = sanitizeMarkdownForAdmin(content);
        break;
      default:
        if (allowedTags && allowedAttributes) {
          sanitized = sanitizeMarkdown(content, {
            allowedTags,
            allowedAttributes,
            allowedSchemes: ['https'],
            stripComments: true,
            stripEmpty: true,
            stripTags: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button']
          });
        } else {
          sanitized = sanitizeMarkdown(content);
        }
    }
    
    return sanitized;
  }, [content, variant, allowedTags, allowedAttributes]);

  // Get sanitization statistics if requested
  const sanitizationStats = useMemo(() => {
    if (!showSanitizationStats || !content) return null;
    
    const { sanitizeMarkdown } = require('@/lib/markdown-sanitizer');
    const stats = require('@/lib/markdown-sanitizer').getSanitizationStats(content, sanitizedContent);
    
    return stats;
  }, [content, sanitizedContent, showSanitizationStats]);

  if (!content) {
    return null;
  }

  return (
    <div className={className}>
      {/* Sanitization statistics */}
      {showSanitizationStats && sanitizationStats && (
        <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-50 rounded">
          <div className="flex justify-between">
            <span>Original: {sanitizationStats.originalLength} chars</span>
            <span>Sanitized: {sanitizationStats.sanitizedLength} chars</span>
            <span>Removed: {sanitizationStats.removedCharacters} chars</span>
            <span>({sanitizationStats.removalPercentage.toFixed(1)}%)</span>
          </div>
        </div>
      )}
      
      {/* Sanitized content */}
      <div 
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      
      {/* Security notice */}
      {variant === 'comment' && (
        <div className="text-xs text-gray-400 mt-2 italic">
          Content has been sanitized for security
        </div>
      )}
    </div>
  );
};

// Export sanitization functions for direct use
export { 
  sanitizeMarkdown, 
  sanitizeMarkdownForBlog, 
  sanitizeMarkdownForComments,
  sanitizeMarkdownForAdmin 
} from '@/lib/markdown-sanitizer';
