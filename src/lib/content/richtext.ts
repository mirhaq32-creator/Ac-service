import "server-only";

/**
 * Minimal safe rich-text renderer for CMS content. Supports paragraphs,
 * "## " headings and "- " list items. Output is built from text nodes only
 * (no dangerouslySetInnerHTML of user input; keys are sanitized to text).
 */
export interface RichBlock {
  type: "p" | "h" | "li";
  text: string;
}

export function parseRichText(text: string): RichBlock[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .flatMap((block): RichBlock[] => {
      if (block.startsWith("## ")) {
        return [{ type: "h" as const, text: block.slice(3).trim() }];
      }
      if (/^[-•] /m.test(block)) {
        return block
          .split("\n")
          .map((line) => line.replace(/^[-•]\s*/, "").trim())
          .filter(Boolean)
          .map((line) => ({ type: "li" as const, text: line }));
      }
      return block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({ type: "p" as const, text: line }));
    });
}
