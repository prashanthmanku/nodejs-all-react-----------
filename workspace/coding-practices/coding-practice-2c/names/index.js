const peoplenames = require("../country/state/city/index");
// console.log(pepolenames);

const firstNames = require("../utilities/utils/index");
// console.log(firstNames(pepolenames));
const getPeopleInCity = (peoplenames) => {
  return firstNames(peoplenames);
};
// console.log(getPeopleInCity(peoplenames));
module.exports = getPeopleInCity;
