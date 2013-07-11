$.widget("bto.betGraph",{ // base class for bet graphs. "abstract"
  _create: function(){
    // this._bets = [];
  },
  _setColorRange: function(){
    this._colorRange = d3.scale.category20();
  }
});
