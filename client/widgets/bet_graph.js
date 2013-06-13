$.widget("bto.betGraph",{ // base class for bet graphs. "abstract"
  _create: function(){
    this._bets = [];
    $(window).resize(_.debounce(this.draw.bind(this), 10));
  },
  bets: function(bets){
    if(bets){
      this._bets = bets;
      this.draw();
    }else{
      return bets;
    }
  },
  _updateColorRange: function(){
    this._colorRange = d3.scale.category20();
  }
});
