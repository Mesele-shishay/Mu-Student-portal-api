/**
 * Cleans text by removing extra whitespace and optionally a prefix
 */
export const cleanText = (text: string, removePrefix?: string): string => {
  let cleaned = text;
  if (removePrefix) {
    cleaned = cleaned.replace(new RegExp(removePrefix, "i"), "");
  }
  return cleaned.replace(/\s+/g, " ").trim();
};
