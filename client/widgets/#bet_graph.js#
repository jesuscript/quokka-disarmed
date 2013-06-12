$.widget("bto.stackedBetGraph",{
  options: {
    positionCount: 100
  },
  _create:function(){
    this._bets = [];
    
    $(window).resize(_.debounce(this._draw.bind(this), 10));
  },
  bets: function(bets){
    if(bets){
      this._bets = bets;
      this.redraw();
    }else{
      return bets;
    }
  },
  redraw: function(){
    this._draw(); //TODO: improve to do only part of draw's work
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
  _draw: function(){
    this.element.find("svg").remove();
    
    this._svg = d3.select(this.element[0]).append("svg");
    var stack = d3.layout.stack();

    var convertedBetsData = this._convertBetsToStackData();
    var yGroupMax = 0;
    var yStackMax = 0;
    var layers = [];
    
    if(convertedBetsData.length){
      layers = stack(convertedBetsData);

      yGroupMax = d3.max(layers, function(layer) {
        return d3.max(layer, function(d) { return d.y; });
      })
      yStackMax = d3.max(layers, function(layer) {
        return d3.max(layer, function(d) { return d.y0 + d.y; });
      });
    }
    
    var width = this.element.width();
    var height =  this.element.height();

    var x = d3.scale.ordinal()
      .domain(d3.range(this.options.positionCount))
      .rangeRoundBands([0, width], .08);

    var y = d3.scale.linear()
      .domain([0, yStackMax])
      .range([height, 0]);

    var color = d3.scale.linear()
      .domain([0, this._bets.count])
      .range(["#ccc", "#777"]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(0)
      .tickPadding(6)
      .orient("bottom");

    var layer = this._svg.selectAll(".layer")
      .data(layers)
      .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i); });

    var rect = layer.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", height)
      .attr("width", x.rangeBand())
      .attr("height", 0);

    rect.transition()
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

    this._svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  }
});

