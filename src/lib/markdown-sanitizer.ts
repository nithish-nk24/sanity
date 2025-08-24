import DOMPurify from 'dompurify';

export interface MarkdownSanitizerConfig {
  allowedTags: string[];
  allowedAttributes: Record<string, string[]>;
  allowedSchemes: string[];
  stripComments: boolean;
  stripEmpty: boolean;
  stripTags: string[];
}

// Default configuration for markdown content
export const DEFAULT_MARKDOWN_CONFIG: MarkdownSanitizerConfig = {
  allowedTags: [
    // Basic text formatting
    'p', 'br', 'hr',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'del',
    'code', 'pre', 'kbd', 'samp', 'var',
    
    // Lists
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    
    // Links and media
    'a', 'img', 'figure', 'figcaption',
    
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
    'colgroup', 'col', 'caption',
    
    // Blockquotes
    'blockquote', 'cite',
    
    // Code blocks
    'div', 'span'
  ],
  
  allowedAttributes: {
    // Link attributes
    'a': ['href', 'title', 'target', 'rel'],
    
    // Image attributes
    'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
    
    // Code attributes
    'code': ['class', 'data-lang'],
    'pre': ['class', 'data-lang'],
    
    // Table attributes
    'table': ['class', 'width'],
    'th': ['scope', 'colspan', 'rowspan'],
    'td': ['colspan', 'rowspan'],
    
    // Generic attributes
    '*': ['class', 'id', 'style', 'title']
  },
  
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  stripComments: true,
  stripEmpty: true,
  stripTags: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button']
};

// Strict configuration for user-generated content
export const STRICT_MARKDOWN_CONFIG: MarkdownSanitizerConfig = {
  allowedTags: [
    'p', 'br', 'hr',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'del',
    'code', 'pre',
    'ul', 'ol', 'li',
    'a', 'img',
    'blockquote'
  ],
  
  allowedAttributes: {
    'a': ['href', 'title'],
    'img': ['src', 'alt', 'title'],
    'code': ['class'],
    'pre': ['class']
  },
  
  allowedSchemes: ['https'],
  stripComments: true,
  stripEmpty: true,
  stripTags: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button']
};

// Sanitize markdown content
export function sanitizeMarkdown(
  content: string,
  config: MarkdownSanitizerConfig = DEFAULT_MARKDOWN_CONFIG
): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // First pass: Basic HTML sanitization
  let sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: config.allowedTags,
    ALLOWED_ATTR: config.allowedAttributes,
    ALLOWED_URI_REGEXP: new RegExp(`^(${config.allowedSchemes.join('|')}):`, 'i'),
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
    RETURN_TRUSTED_TYPE: false,
    FORBID_TAGS: config.stripTags,
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
    ADD_ATTR: ['target'],
    ADD_DATA_URI_TAGS: ['img'],
    SANITIZE_DOM: true,
    WHOLE_DOCUMENT: false,
    RETURN_TRUSTED_TYPE: false
  });

  // Second pass: Remove any remaining dangerous content
  sanitized = removeDangerousContent(sanitized);
  
  // Third pass: Clean up empty elements if configured
  if (config.stripEmpty) {
    sanitized = removeEmptyElements(sanitized);
  }

  return sanitized;
}

// Remove dangerous content patterns
function removeDangerousContent(content: string): string {
  // Remove JavaScript event handlers
  content = content.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: URLs
  content = content.replace(/javascript:\s*[^"'\s]+/gi, '');
  
  // Remove data: URLs (except for images)
  content = content.replace(/data:(?!image\/)[^"'\s]+/gi, '');
  
  // Remove vbscript: URLs
  content = content.replace(/vbscript:\s*[^"'\s]+/gi, '');
  
  // Remove any remaining script tags
  content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Remove any remaining style tags
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove any remaining iframe tags
  content = content.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
  
  // Remove any remaining object tags
  content = content.replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '');
  
  // Remove any remaining embed tags
  content = content.replace(/<embed[^>]*>/gi, '');
  
  // Remove any remaining form tags
  content = content.replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '');
  
  return content;
}

// Remove empty elements
function removeEmptyElements(content: string): string {
  // Remove empty paragraphs
  content = content.replace(/<p[^>]*>\s*<\/p>/gi, '');
  
  // Remove empty divs
  content = content.replace(/<div[^>]*>\s*<\/div>/gi, '');
  
  // Remove empty spans
  content = content.replace(/<span[^>]*>\s*<\/span>/gi, '');
  
  // Remove empty headings
  content = content.replace(/<h[1-6][^>]*>\s*<\/h[1-6]>/gi, '');
  
  // Remove empty list items
  content = content.replace(/<li[^>]*>\s*<\/li>/gi, '');
  
  return content;
}

// Validate and sanitize image URLs
export function validateAndSanitizeImageUrl(
  url: string,
  allowedDomains: string[] = []
): { isValid: boolean; sanitizedUrl?: string; error?: string } {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'Invalid URL' };
  }

  try {
    const urlObj = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
    }
    
    // Check for dangerous patterns
    if (url.includes('javascript:') || url.includes('data:') || url.includes('vbscript:')) {
      return { isValid: false, error: 'URL contains dangerous content' };
    }
    
    // Check domain if restrictions are set
    if (allowedDomains.length > 0) {
      const domain = urlObj.hostname.toLowerCase();
      const isAllowed = allowedDomains.some(allowed => {
        if (allowed.startsWith('*.')) {
          return domain.endsWith(allowed.substring(2));
        }
        return domain === allowed;
      });
      
      if (!isAllowed) {
        return { isValid: false, error: 'Domain not allowed' };
      }
    }
    
    // Sanitize the URL
    const sanitizedUrl = DOMPurify.sanitize(url, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
    
    return { isValid: true, sanitizedUrl };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

// Sanitize markdown with specific tag restrictions
export function sanitizeMarkdownWithRestrictions(
  content: string,
  allowedTags: string[],
  allowedAttributes: Record<string, string[]> = {}
): string {
  const config: MarkdownSanitizerConfig = {
    ...DEFAULT_MARKDOWN_CONFIG,
    allowedTags,
    allowedAttributes: { ...DEFAULT_MARKDOWN_CONFIG.allowedAttributes, ...allowedAttributes }
  };
  
  return sanitizeMarkdown(content, config);
}

// Sanitize markdown for comments (very restrictive)
export function sanitizeMarkdownForComments(content: string): string {
  const config: MarkdownSanitizerConfig = {
    allowedTags: ['p', 'br', 'strong', 'em', 'code'],
    allowedAttributes: {
      'code': ['class']
    },
    allowedSchemes: [],
    stripComments: true,
    stripEmpty: true,
    stripTags: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button']
  };
  
  return sanitizeMarkdown(content, config);
}

// Sanitize markdown for blog posts (moderate restrictions)
export function sanitizeMarkdownForBlog(content: string): string {
  return sanitizeMarkdown(content, DEFAULT_MARKDOWN_CONFIG);
}

// Sanitize markdown for admin content (less restrictive)
export function sanitizeMarkdownForAdmin(content: string): string {
  const config: MarkdownSanitizerConfig = {
    ...DEFAULT_MARKDOWN_CONFIG,
    allowedTags: [...DEFAULT_MARKDOWN_CONFIG.allowedTags, 'iframe', 'embed'],
    allowedAttributes: {
      ...DEFAULT_MARKDOWN_CONFIG.allowedAttributes,
      'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
      'embed': ['src', 'width', 'height', 'type']
    }
  };
  
  return sanitizeMarkdown(content, config);
}

// Get sanitization statistics
export function getSanitizationStats(
  originalContent: string,
  sanitizedContent: string
): {
  originalLength: number;
  sanitizedLength: number;
  removedCharacters: number;
  removalPercentage: number;
} {
  const originalLength = originalContent.length;
  const sanitizedLength = sanitizedContent.length;
  const removedCharacters = originalLength - sanitizedLength;
  const removalPercentage = originalLength > 0 ? (removedCharacters / originalLength) * 100 : 0;
  
  return {
    originalLength,
    sanitizedLength,
    removedCharacters,
    removalPercentage
  };
}
