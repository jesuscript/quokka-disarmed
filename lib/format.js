// for humans, the default display formatting function, returns a string
intToBtc = function(val){
  return (val / 100000000).toFixed(8);
};

// for machines with further calculations, returns a float
intToBtcFloat = function(val){
  return val / 100000000;
};

btcToInt = function(val){
  return Math.round(val * 100000000);
};

// returns a float to precision 
preciseRound = function(num,decimals){
  return Math.round(num*Math.pow(10,decimals)) / Math.pow(10,decimals);
};