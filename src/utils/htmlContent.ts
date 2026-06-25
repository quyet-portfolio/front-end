// Signal that a blog's HTML was stored entity-escaped: it contains an escaped
// CLOSING block tag (e.g. "&lt;/p&gt;", "&lt;/h1&gt;"). A normal post never
// renders a closing block tag as visible text, so this is a near-certain sign
// the whole markup was escaped (HTML pasted into the visual editor as text).
const ESCAPED_CLOSING_BLOCK_TAG =
  /&lt;\/(p|h[1-6]|div|ul|ol|li|blockquote|pre|table|thead|tbody|tr|td|th|figure|section|article)&gt;/i

/**
 * Recover legacy blog content that was saved HTML-escaped so its tags render as
 * literal text ("<p>...</p>"). When escaped markup is detected, decode one
 * entity level so the HTML renders. Content that already holds real tags (the
 * correct case) is returned untouched.
 */
export function recoverEscapedHtml(content: string): string {
  if (!content || !ESCAPED_CLOSING_BLOCK_TAG.test(content)) return content

  // Decode `&amp;` last so a double-escaped "&amp;amp;" collapses by one level only.
  return content
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&amp;/g, '&')
}
