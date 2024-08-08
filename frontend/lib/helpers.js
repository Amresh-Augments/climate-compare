// helpers.js
/**
 * Converts a string to a readable format by capitalizing the first letter of each word and replacing underscores with spaces.
 *
 * @param {string} str - The string to be converted.
 * @returns {string} - The converted string.
 */
export const makeReadable = (str) => {
  if (!str) return "";
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
