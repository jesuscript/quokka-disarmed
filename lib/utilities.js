humanTimestamp = function(){
  var d = new Date();
  return d.toDateString() + ' ' + d.toTimeString();
};


// attach the .compare method to Array's prototype to call it on any array
Array.prototype.compare = function (array) {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length !== array.length) return false;

  for (var i = 0; i < this.length; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].compare(array[i]))  return false;
    }
    else if (!_.isEqual(this[i], array[i])) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20} so im using underscore here
      return false;
    }
  }
  return true;
};


// will validate 10.0 as valid
isValidInt = function(numToCheck) {
  return Match.test(numToCheck, Match.Integer);
};