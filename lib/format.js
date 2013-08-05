// floats for machines, strings for humans
intToBtc = function(val, opts){
  var args = opts || {};
  var datatype = (typeof args.datatype === 'undefined') ? 'string' : args.datatype;
  if (datatype === 'string') {
    return (val / 100000000).toFixed(8);
  } else {
    return val / 100000000;
  }
};

btcToInt = function(val){
  return Math.round(val * 100000000);
};

// returns a float to precision 
preciseRound = function(num,decimals){
  return Math.round(num*Math.pow(10,decimals)) / Math.pow(10,decimals);
};
