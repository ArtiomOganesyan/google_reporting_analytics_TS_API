export const errorCreation = (arr: string[]): any => {
  let errorObject: { error: { message: string }[] } = {
    error: [],
  };

  arr.forEach((errStr) => {
    errorObject.error.push({
      message: errStr,
    });
  });

  return errorObject;
};
