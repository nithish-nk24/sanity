"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { validateAndSanitizeImageUrl } from '@/lib/markdown-sanitizer';

export interface SecureImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  allowedDomains?: string[];
  fallbackSrc?: string;
  showValidationInfo?: boolean;
  onError?: (error: string) => void;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export const SecureImage: React.FC<SecureImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  allowedDomains = [],
  fallbackSrc = '/images/placeholder.jpg',
  showValidationInfo = false,
  onError,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL
}) => {
  const [imageError, setImageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate and sanitize the image URL
  const { isValid, sanitizedUrl, error } = useMemo(() => {
    if (!src) {
      return { isValid: false, error: 'No image source provided' };
    }
    
    return validateAndSanitizeImageUrl(src, allowedDomains);
  }, [src, allowedDomains]);

  // Use sanitized URL or fallback
  const imageSrc = useMemo(() => {
    if (isValid && sanitizedUrl) {
      return sanitizedUrl;
    }
    
    if (onError && error) {
      onError(error);
    }
    
    return fallbackSrc;
  }, [isValid, sanitizedUrl, error, fallbackSrc, onError]);

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    setImageError(null);
  };

  // Handle image error
  const handleError = () => {
    setIsLoading(false);
    setImageError('Failed to load image');
    
    if (onError) {
      onError('Failed to load image');
    }
  };

  // Show validation info if requested
  if (showValidationInfo) {
    return (
      <div className={`relative ${className}`}>
        {/* Validation status */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium z-10 ${
          isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isValid ? '✓ Valid' : '✗ Invalid'}
        </div>
        
        {/* Validation details */}
        {!isValid && error && (
          <div className="absolute top-2 right-2 max-w-xs">
            <div className="bg-red-100 text-red-800 text-xs p-2 rounded shadow-lg">
              <strong>Validation Error:</strong> {error}
            </div>
          </div>
        )}
        
        {/* Image */}
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoading ? 'opacity-50' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {/* Error indicator */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-50">
            <div className="text-red-600 text-sm text-center">
              <div className="font-medium">Image Error</div>
              <div className="text-xs">{imageError}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular secure image without validation info
  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-50' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {/* Error indicator */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-50">
          <div className="text-red-600 text-xs text-center">
            <div className="font-medium">Error</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export validation function for direct use
export { validateAndSanitizeImageUrl } from '@/lib/markdown-sanitizer';

// Predefined allowed domains for common image services
export const COMMON_IMAGE_DOMAINS = [
  'images.unsplash.com',
  'utfs.io',
  'cdn.jsdelivr.net',
  '*.cloudinary.com',
  '*.imgur.com',
  '*.flickr.com'
] as const;

// Secure image with common domain restrictions
export const CommonSecureImage: React.FC<Omit<SecureImageProps, 'allowedDomains'>> = (props) => (
  <SecureImage {...props} allowedDomains={COMMON_IMAGE_DOMAINS} />
);

// Strict secure image (HTTPS only, no external domains)
export const StrictSecureImage: React.FC<Omit<SecureImageProps, 'allowedDomains'>> = (props) => (
  <SecureImage {...props} allowedDomains={[]} />
);
