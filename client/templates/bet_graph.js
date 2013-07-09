Template.betGraph.created = function () {

  var bets = [];
  var chart;

  nv.addGraph(function() {
    chart = nv.models.multiBarChart()
                  .x(function(d) { return d[0] })
                  .y(function(d) { return d[1] })
                  .clipEdge(false)
                  .noData('Loading Bets...')
                  .stacked(true)
                  .showControls(false);

    chart.xAxis
        .tickFormat(d3.format('d'))
        .showMaxMin(true);

    chart.yAxis
        .tickFormat(d3.format(',.4f'));

    d3.select('#bet-graph svg')
      .datum(bets)
      .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });


  Deps.autorun(function(){
    console.log('deps.autorun on bets() invoked');
    redraw(Collections.Bets.find().fetch());
  });


  function redraw(betsCollection) {
    if (betsCollection && chart) {
      var nvd3data = convertBetsCollectionToStackData(betsCollection);
      console.dir(nvd3data);
      d3.select('#bet-graph svg')
        .datum(nvd3data)
        .transition().duration(200).call(chart);
    }
  };


  function convertBetsCollectionToStackData(betCollection) {
    console.log('converting bets..');
    var convertedBets = [];
    for (var i = betCollection.length - 1; i >= 0; i--) {
      var userBets = [];
      for (var num = 1; num<=100; num++) {
        if (num >= betCollection[i].rangeMin && num <= betCollection[i].rangeMax) {
          var rangeSize = betCollection[i].rangeMax - betCollection[i].rangeMin;
          userBets.push( [num, intToBtc(betCollection[i].amount/rangeSize)] );
        } else {
          userBets.push( [num, 0] );
        }
      }
      convertedBets.push( {"key": betCollection[i].playerName, "values": userBets} );
    };
    return convertedBets;
  };

};



