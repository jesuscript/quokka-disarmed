intToBtc = function(val){
  return (val / 100000000).toFixed(8);
};

btcToInt = function(val){
  return Math.round(val * 100000000);
};


