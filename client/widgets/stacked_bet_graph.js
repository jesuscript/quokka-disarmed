$.widget("bto.stackedBetGraph",$.bto.betGraph,{
  options: {
    positionCount: 100
  },
  _create: function(){
    this._super();
    
    $(window).resize(_.debounce(this.draw.bind(this), 10));
    
    this._stack = d3.layout.stack();

    this.draw();
  },
  
  draw: function(){
    this.element.find("svg").remove();
    this._svg = d3.select(this.element[0]).append("svg");

    this._updateStack();
    this._updateAxesData();
    this._updateColorRange();
    this._drawMainLayer();
    this._drawRects();
    this._drawXAxis();
    this._drawYAxis();
  },
  bets: function(bets){
    if(bets){
      this._bets = bets;
      this._updateStack();
    }else{
      return bets;
    }
  },
  _updateStack: function(){
    var convertedBetsData = this._convertBetsToStackData();

    this._yStackMax = 0;
    this._layers = [];
    
    if(convertedBetsData.length){
      this._layers = this._stack(convertedBetsData);

      this._yStackMax = d3.max(this._layers, function(layer) {
        return d3.max(layer, function(d) { return d.y0 + d.y; });
      });
    }
  },
  _convertBetsToStackData:function(){
    return _.map(this._bets, function(bet){
      return _.map(d3.range(100),function(i){
        var inRange = (i >= bet.rangeMin) && (i <= bet.rangeMax);
        var amountPerNumber = bet.amount / (bet.rangeMax - bet.rangeMin + 1);
        
        return {
          x: i,
          y: inRange ? amountPerNumber : 0
        };
      });
    });
  },
  _updateAxesData: function(){
    this._graphWidth = this.element.width();
    this._graphHeight =  this.element.height();

    this._x = d3.scale.ordinal()
      .domain(d3.range(this.options.positionCount))
      .rangeRoundBands([0, this._graphWidth], .08);

    this._y = d3.scale.linear()
      .domain([0, this._yStackMax])
      .range([this._graphHeight, 0]);
  },
  _drawMainLayer: function(){
    this._mainLayer = this._svg.selectAll(".layer")
      .data(this._layers)
      .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) {
        return this._colorRange(i);
      }.bind(this));
  },
  _drawRects: function(){
    var rects = this._mainLayer.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("x", function(d) { return this._x(d.x); }.bind(this))
      .attr("y", this._graphHeight)
      .attr("width", this._x.rangeBand())
      .attr("height", 0);

    rects.transition()
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return this._y(d.y0 + d.y); }.bind(this))
      .attr("height", function(d) { return this._y(d.y0) - this._y(d.y0 + d.y); }.bind(this));
  },
  _drawXAxis: function(){
    var xAxis = d3.svg.axis().scale(this._x).tickSize(0).tickPadding(6).orient("bottom");
    
    this._svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this._graphHeight + ")")
      .call(xAxis);
  },
  _drawYAxis: function(){
    var yAxis = d3.svg.axis().scale(this._y).orient("left").tickFormat(d3.format(".2s"));

    this._svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("BTC");
  }
});

