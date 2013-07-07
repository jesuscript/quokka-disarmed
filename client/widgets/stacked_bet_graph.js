$.widget("bto.stackedBetGraph",$.bto.betGraph,{
  
  _create: function(){
    console.log('calling create');
    this._super();


    var histcatexpshort = [ 
      { 
        "key" : "Johan Daugh" , 
        "values" : [ [ 1 , 20] , [ 2 , 20] , [ 3 , 20] ] 
      } , 
      { 
        "key" : "bob ddd" , 
        "values" : [ [ 1 , 10] , [ 2 , 10] , [ 3 , 10] ] 
      } , 
      { 
        "key" : "Smith joen" , 
        "values" : [ [ 1 , 5] , [ 2 , 5] , [ 3 , 5] ] 
      }
    ];   

    nv.addGraph(function() {
      var chart = nv.models.stackedAreaChart()
                    .x(function(d) { return d[0] })
                    .y(function(d) { return d[1] })
                    .clipEdge(true);


      chart.xAxis
          .showMaxMin(false);


      chart.yAxis
          .tickFormat(d3.format(',.2f'));

        d3.select('.bet-graph svg')
          .datum(histcatexpshort)
            .transition().duration(500).call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });



  },


  bets: function(bets){
    if(bets){
      this._bets = bets;
      this._convertBetsToStackData()
      this.redraw();
    }
    return bets;
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

       d3.select('.bet-graph svg')
          .datum(this._nvd3Data)
            .transition().duration(500).call(chart);
  },


});

