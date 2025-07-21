import DOMPurify from 'dompurify';

/**
 * Content sanitization utilities using DOMPurify to prevent XSS attacks
 * Note: Rate limiting should be implemented on the server-side, not client-side
 */

/**
 * Sanitizes user-generated content for safe display
 */
export function sanitizeUserContent(content: string): string {
  if (typeof content !== 'string') return '';
  
  // Clean the content with DOMPurify
  const cleaned = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
  
  // Additional safety: limit length and trim
  return cleaned.trim().slice(0, 5000);
}

/**
 * Sanitizes plain text content (strips all HTML)
 */
export function sanitizePlainText(text: string): string {
  if (typeof text !== 'string') return '';
  
  // Strip all HTML tags and decode entities
  const cleaned = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
  
  return cleaned.trim().slice(0, 10000);
}

/**
 * Validates and sanitizes user names
 */
export function sanitizeName(name: string): string {
  if (typeof name !== 'string') return '';
  
  // Remove any HTML and keep only safe characters
  const cleaned = sanitizePlainText(name);
  
  // Allow only letters, numbers, spaces, hyphens, apostrophes, and periods
  const safeName = cleaned.replace(/[^a-zA-Z0-9\s\-'.]/g, '');
  
  return safeName.trim().slice(0, 100);
}

/**
 * Validates email format and prevents injection
 */
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  
  // Clean the email first
  const cleaned = sanitizePlainText(email);
  
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(cleaned) && cleaned.length <= 254;
}

/**
 * Sanitizes search queries to prevent injection
 */
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') return '';
  
  // Strip HTML and limit to safe characters
  const cleaned = sanitizePlainText(query);
  
  // Remove special regex characters that could cause ReDoS
  const safeQuery = cleaned.replace(/[.*+?^${}()|[\]\\]/g, '');
  
  return safeQuery.trim().slice(0, 100);
}

/**
 * Validates that content length is within acceptable bounds
 */
export function validateContentLength(content: string, maxLength: number = 5000): boolean {
  if (typeof content !== 'string') return false;
  return content.length <= maxLength && content.trim().length > 0;
}