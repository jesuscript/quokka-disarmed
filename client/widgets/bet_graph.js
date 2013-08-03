$.widget("bto.betGraph",{ // base class for bet graphs. "abstract"
  _create: function(){
    this._d3data = []; // bets!=d3data
  },

  _setColorRange: function(){
    this._colorRange = d3.scale.category20();
  },

  // generates human friendly color that harmonize well. Will stick to each user as they are based on playerId hash
  _getPlayerColor: function(playerId){
    var hashInt  = playerId.split("").reduce(function(a,b){ // grab the 18 char mongoId and simulate java hashcode to get an int as close to unique as possible
      a = ((a<<5)-a) + b.charCodeAt(0);
      return a&a;
    } ,0);          

    hashInt = (hashInt > 2147483634) ? 2147483634 : hashInt; // range was established from parsing 10M potential strings. May not be completely accurate

    var h = Math.round(Math.abs(hashInt/2147483634 * 360)); 

    var rgbColor = hsvToRgb(h, 60, 90); // HSV is the only human-friendly color space when randomizing hue

    return d3.rgb(rgbColor[0], rgbColor[1], rgbColor[2]); // D3 does not support HSV natively

  }, 

  _hsvToRgb: function(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;
   
    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    s /= 100;
    v /= 100;
   
    if(s === 0) {
      // Achromatic (grey)
      r = g = b = v;
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
   
    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
   
    switch(i) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
 
    case 1:
      r = q;
      g = v;
      b = p;
      break;
 
    case 2:
      r = p;
      g = v;
      b = t;
      break;
 
    case 3:
      r = p;
      g = q;
      b = v;
      break;
 
    case 4:
      r = t;
      g = p;
      b = v;
      break;
 
    default: // case 5:
      r = v;
      g = p;
      b = q;
    }
   
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

});



