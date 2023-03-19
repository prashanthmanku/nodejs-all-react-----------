const ratioOfTwonumbers = require("../ratio/index");
// console.log(ratioOfTwonumbers(4, 2));
const factorialOfNumber = require("../factorial/index");
// console.log(factorialOfNumber(3));
const ratioAndFactorial = (n1, n2, n3) => {
  const ratio = ratioOfTwonumbers(n1, n2);
  const factorial = factorialOfNumber(n3);
  //   console.log({ ratio, factorial });
  return { ratio, factorial };
};
// ratioAndFactorial(8, 2, 4);
//o/p:{ ratio: 4, factorial: 24 }
module.exports = ratioAndFactorial;
