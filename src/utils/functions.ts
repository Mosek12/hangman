import randomWords from "random-words";

function compareArrays(array1: string[], array2: string[]): boolean {
  return array1.every((element) => {
    if (array2.includes(element)) {
      return true;
    }

    return false;
  });
}

function getRandomWordInLetters() {
  let word: string = randomWords(1)[0];
  return word.split("") as letter[];
}

export { compareArrays, getRandomWordInLetters };
