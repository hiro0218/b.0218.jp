export const compareIsoStrings = (firstString: string, secondString: string): number => {
  let currentIndex = 0;
  let charCodeDifference = 0;

  for (; currentIndex < secondString.length; currentIndex++) {
    charCodeDifference = firstString.charCodeAt(currentIndex) - secondString.charCodeAt(currentIndex);
    if (charCodeDifference !== 0) {
      return charCodeDifference;
    }
  }

  return charCodeDifference;
};
