export const generateRandomNumbers = (min: number, max: number) => {
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
};
