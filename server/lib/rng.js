GetRandInt = function () {
  var crypto = Npm.require("crypto");
  var foundInt = false;
  var randomInt;
  while (!foundInt) {
    var randomByte = crypto.randomBytes(1);
    var randomHex = randomByte.toString('hex');
    randomInt = parseInt(randomHex, 16);
    if (randomInt >= 1 && randomInt <= 100) { 
      foundInt = true; 
    }
  }
  return randomInt;
};
