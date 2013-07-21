$.widget("bto.betGraph",{ // base class for bet graphs. "abstract"
  _create: function(){
    this._d3data = []; // bets!=d3data
  },
  _setColorRange: function(){
    this._colorRange = d3.scale.category20();
  }
});
