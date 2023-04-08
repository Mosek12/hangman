function compareArrays(array1, array2) {
  return array1.every((element) => {
    if (array2.includes(element)) {
      return true;
    }

    return false;
  });
}

export { compareArrays };
