$.widget("bto.stackedBetGraph",$.bto.betGraph,{
  
  _bets: [],
  valueArray: [],
  rootContainer: '',

  bets: function(bets){
    if(bets){
      this._bets = bets;
      this.recalculateBets();
      this.redraw();
    }
    return bets;
  },


  _create: function(){
    this._super();
    $(window).resize(_.debounce(this.draw.bind(this), 5));
    this.draw();
  },


  draw: function() {
    console.log('draw invoked');
    this.element.find("svg").remove();
    this._svg = d3.select(this.element[0]).append("svg");

    var margin = {top: 40, right: 15, bottom: 30, left: 25};
    var targetWidth = this.element.width();
    var svgWidth = targetWidth;
    var svgHeight = 120;
    var barWidth = targetWidth/140;
    var titleShift = 20;
    var chartWidth = svgWidth - margin.left - margin.right - titleShift;
    var chartHeight = svgHeight - margin.top - margin.bottom;
    
    var x = d3.scale.linear()
      .domain([1, 100])
      .range([0, chartWidth]);

    var y = d3.scale.linear()
      .range([chartHeight, 0]);

    y.domain([0, d3.max(this.valueArray, function(d) { return d.total; })]);

    function getXTickValues() {
      var modulo;
      if (chartWidth > 1600) {
        modulo = 1;
      } else if (chartWidth > 400) {
        modulo = 5;
      } else {
        modulo = 10;
      }
      var theArray = [1];
      for (var i = 1; i <= 100; i++) {
        if (i % modulo === 0  ) theArray.push(i);
      };
      return theArray;
    }

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickValues(getXTickValues());

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(3);

    this._svg.selectAll("g").remove();
    this._svg.selectAll(".bar").remove();
    
    this.rootContainer = this._svg.attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.rootContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + titleShift + "," + chartHeight + ")")
      .call(xAxis);

    this.rootContainer.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("BTC");

    this.rootContainer.selectAll(".bar")
      .data(this.valueArray)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.num); })
      .attr("width", barWidth)
      .attr("transform", "translate(" + (titleShift - (barWidth/2)) + ",0)")
      .attr("y", function(d) { return y(d.total); })
      .attr("height", function(d) { return chartHeight - y(d.total); })
  },


  redraw: function() {
    console.log('redraw invoked');
    var margin = {top: 40, right: 15, bottom: 30, left: 25};
    var targetWidth = this.element.width();
    var svgWidth = targetWidth;
    var svgHeight = 120;
    var barWidth = targetWidth/140;
    var titleShift = 20;
    var chartWidth = svgWidth - margin.left - margin.right - titleShift;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    var y = d3.scale.linear()
        .range([chartHeight, 0]);

    y.domain([0, d3.max(this.valueArray, function(d) { return d.total; })]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(3);

    this.rootContainer.select(".y.axis").transition().call(yAxis);

    this.rootContainer.selectAll(".bar")
        .data(this.valueArray)
        .transition()
        .duration(500)
        .attr("y", function(d) { return y(d.total); })
        .attr("height", function(d) { return chartHeight - y(d.total); })
  },


  bet: function() {
    var rAmount1 = this.getRandomInt(1, 100);
    var rAmount2 = this.getRandomInt(rAmount1, 100);
    this._bets.push({"username": this.generateRandomName(), "num1": rAmount1, "num2": rAmount2});
    this.recalculateBets();
    this.redraw();
  },


  revoke: function() {
    this._bets.splice(Math.floor(Math.random() * this.bets.length), 1);
    this.recalculateBets();
    this.redraw();
  },


  recalculateBets: function() {
    var convertedBets = [];

    for (var i = this._bets.length - 1; i >= 0; i--) {
      for (var j = this._bets[i].rangeMax; j >= this._bets[i].rangeMin; j--) {
        var rangeSize = this._bets[i].rangeMax - this._bets[i].rangeMin;
        if (rangeSize == 0) rangeSize = 1;
        convertedBets.push( {"amount": this._bets[i].amount/rangeSize/100000000, "num": j} );
      }
    };

    this.valueArray = [];
  
    for (var i = 1; i<=100; i++) {
      var total = 0;
      for (var j = convertedBets.length - 1; j >= 0; j--) {
        if (convertedBets[j].num == i) total = total + convertedBets[j].amount;
      };
      this.valueArray.push( {"num": i, "total": total} );
    }
  },


  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

});

