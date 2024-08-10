export function makeReadable(hyphenatedText) {
  // CODE FOR TASK 3.3 -------------------------------------------

  const words = hyphenatedText.split('-');
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // END OF CODE FOR TASK 3.3 ------------------------------------
}
