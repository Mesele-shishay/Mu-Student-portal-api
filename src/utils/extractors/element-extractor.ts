import { CheerioAPI } from "cheerio";
import { cleanText } from "../parsers/text-cleaner";

/**
 * Helper function to extract text from element with fallbacks
 */
export const extractElementText = (
  $: CheerioAPI,
  mainSelector: string,
  removePrefix?: string
): string => {
  // Try first with strong tag
  const withStrong = $(`${mainSelector} strong`).next().text();
  if (withStrong) {
    return cleanText(withStrong);
  }

  // Try direct text content after strong
  const afterStrong = $(`${mainSelector}`).find("strong").next().text();
  if (afterStrong) {
    return cleanText(afterStrong);
  }

  // Try direct text content
  const directText = $(mainSelector).text();
  if (directText) {
    return cleanText(directText, removePrefix);
  }

  return "";
};
