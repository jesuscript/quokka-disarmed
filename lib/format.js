// for humans, the default function
intToBtc = function(val){
  return (val / 100000000).toFixed(8);
};

// for machines, some libs don't like toFixed()
floatIntToBtc = function(val){
  return val / 100000000;
};

btcToInt = function(val, floor){
  return floor ? Math.round(val * 100000000) : Math.round(val * 100000000);
};


