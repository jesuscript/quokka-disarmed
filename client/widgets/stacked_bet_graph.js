$.widget("bto.stackedBetGraph",$.bto.betGraph,{
  
  _nvd3Data: [],

  _create: function(){

    this._super();
    self = this;

    nv.addGraph(function() {
      self.chart = nv.models.stackedAreaChart()
                    .x(function(d) { return d[0] })
                    .y(function(d) { return d[1] })
                    .clipEdge(true);

      self.chart.xAxis
          .showMaxMin(false);

      self.chart.yAxis
          .tickFormat(d3.format(',.2f'));

      console.log('self._nvd3Data before invokating in create = ' + self._nvd3Data);
      
      d3.select('.bet-graph svg')
      .datum(self._nvd3Data)
      .transition().duration(500).call(self.chart);

      nv.utils.windowResize(self.chart.update);
      chart = self.chart;
      return chart;
    });
  },


  bets: function(bets){
    console.log('incoming bets' + bets);
    if (this.chart) {
      this._bets = bets;
      this._convertBetsToStackData();
      this.redraw();
    }
  },


  _convertBetsToStackData:function(){
    var convertedBets = [];
    for (var i = this._bets.length - 1; i >= 0; i--) {
      var userBets = [];
      for (var num = 1; num<=100; num++) {
        if (num >= this._bets[i].rangeMin && num <= this._bets[i].rangeMax) {
          var rangeSize = this._bets[i].rangeMax - this._bets[i].rangeMin;
          userBets.push( [num, intToBtc(this._bets[i].amount/rangeSize)] );
        } else {
          userBets.push( [num, 0] );
        }
      }
      convertedBets.push( {"key": this._bets[i].playerId, "values": userBets} );
    };
    this._nvd3Data = convertedBets;
  },


  // draw: function() {
    
  // },


  redraw: function() {

    console.log('trying to redraw, state of this.chart is:' + this.chart);
     d3.select('.bet-graph svg')
    .datum(this._nvd3Data)
    .transition().duration(500);
  },


});

