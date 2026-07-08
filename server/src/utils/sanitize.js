import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML on the server side
 * @param {string} dirty - Raw HTML string
 * @returns {string} Sanitized HTML string
 */
export const sanitizeHTML = (dirty) => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['class'],
  });
};

/**
 * Sanitize plain text (strip all HTML)
 * @param {string} dirty
 * @returns {string}
 */
export const sanitizeText = (dirty) => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
};

export default { sanitizeHTML, sanitizeText };
