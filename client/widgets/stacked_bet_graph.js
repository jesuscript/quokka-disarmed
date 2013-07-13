$.widget('bto.stackedBetGraph',$.bto.betGraph,{
  
  _create: function(){
    console.log('stackedBetGraph create()');
    this._super();

    this._d3data = [];

    // properties (instance) definitions, jquery widget requires for them to be located here
    // this._chartWidth and this._chartHeight refer to the drawn area on the chart. The rest are margins so axis legend doesn't get clipped
    this._yAxisLabelShift = 15; // shift everything to the right to give room for the y axis label for it not to be covered by the bar on x = 1
    this._margin = {top: 10, right: 15, bottom: 18, left: 40}; // using 'best practice' d3 margin definitions by attaching all elements to a bounding box
    this._chartHeight = 150 - this._margin.top - this._margin.bottom; // chart never resizes vertically

    $(window).resize(_.debounce(this._draw.bind(this), 100)); // debouncing at 100 seems to be enough to avoid re-rendering while mouse is still moving

    this._svg = d3.select(this.element[0]).append('svg');

    this._draw();
  },


  _draw: function() {
    console.log('draw() invoked()');

    this._setColorRange();

    this._chartWidth = this.element.width() - this._margin.left - this._margin.right - this._yAxisLabelShift; // due to lag in rendering this needs to be placed here to be accurate, and not on _create

    this._udpdateStack();

    this._defineAxes();

    this._svg.selectAll("g").remove(); // don't remove entire SVG when redrawing - just the groups (will kill off children nodes)

    this._chartArea = this._svg // define bounding box
      .append('g')
        .attr('transform', 'translate(' + this._margin.left + ',' + this._margin.top + ')'); // new root coords at top left corner of margins

    this._drawAxes();

    this._staticRedraw();

  },


  _staticRedraw: function() { // behaviour for resize-driven draw. Doens't contain transitions.
    this._seriesDefineD3Sequence();

    // feed data
    this._rects = this._series.selectAll("rect")
    .data(function(d) { return d; })

    // enter behaviour
    this._rects.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return this._x(d.x); }.bind(this))
      .attr("y", function(d) { return Math.ceil(this._y(d.y0 + d.y)); }.bind(this)) // Anti Aliasing on y
      .attr("width", Math.floor(this._x.rangeBand())) // AA on width
      .attr("height", function(d) { return Math.floor(this._y(d.y0) - this._y(d.y0 + d.y)); }.bind(this)); // Anti Aliasing on height
  },


  // define axises. Called once on draw().
  _defineAxes: function() {
    this._x = d3.scale.ordinal()
          .domain(d3.range(1,101))
          .rangeBands([0, this._chartWidth], .3); // roundRangeBands creates significant rounding errors leading to a squeezed graphic

    this._xAxis = d3.svg.axis()
      .scale(this._x)
      .orient('bottom')
      .tickValues(this._getXTickValues()) // rescale x axis so tick labels don't overlap
      .tickSize(5,3,0); // remove end ticks to avoid uglyness

    this._y = d3.scale.linear()
      .domain([0, this._yStackMax])
      .range([this._chartHeight, 0]);

    this._yAxis = d3.svg.axis()
      .scale(this._y)
      .orient("left")
      .ticks(5) // approximate tick count
      .tickSize(4,2,0) // remove end ticks to avoid uglyness
      .tickFormat(d3.format(".2s"));
  },


  // draw axises. Called once on draw().
  _drawAxes: function() {
    this._chartArea.append('g')
      .attr("class", "x axis")
      .attr("transform", "translate(" + this._yAxisLabelShift + "," + this._chartHeight + ")")
      .call(this._xAxis);

    this._chartArea.append("g")
      .attr("class", "y axis")
      .call(this._yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("BTC");
  },


  _udpdateStack: function() {
    this._yStackMax = 0;
    this._layers = [];

    if (this._d3data.length) {  
      this._layers = d3.layout.stack()(this._d3data); // calculate x, y0 and y for each series
      
      this._yStackMax = d3.max(this._layers, function(layer) {
        return d3.max(layer, function(d) { return d.y0 + d.y; }); // highest y0 + y == top most point on chart
      });
    }
  },


  redraw: function(betCollection) {
    console.log('redraw invoked');
    if (betCollection) {
      console.log('redraw accepted');
      this._d3data = this._convertBetsToStackData(betCollection);
          
      this._udpdateStack();

      this._transitionYAxis();

      this._seriesDefineD3Sequence();

      this._rectDefineD3Sequence();
    }
  },


  _transitionYAxis:function(){
    this._y.domain([0, this._yStackMax])
    .range([this._chartHeight, 0]);

    this._chartArea.select(".y.axis").transition().duration(1000).call(this._yAxis);  
  },


  _seriesDefineD3Sequence:function(){ 
    // feed data
    this._series = this._chartArea.selectAll(".series") // selections HAVE to be rerun, can't just refer to variable to update
      .data(this._layers)

    // update

    // enter behaviour
    this._series.enter()
      .append("g")
        .attr("class", "series")
        .attr("transform", "translate(" + this._yAxisLabelShift + ",0)")
        .style("fill", function(d, i) { return this._colorRange(i); }.bind(this));

    // enter + update

    // exit behaviour
    //this._series.exit().each(function() {console.log('series');}).transition().delay(2000).remove(); // delay so we can cascade out the removed bet
  },


  _rectDefineD3Sequence:function(){ 

    // feed data
    this._rects = this._series.selectAll("rect") // selections HAVE to be rerun, can't just refer to variable to update
      .data(function(d) { return d; })

    // update behaviour
    this._rects
      .attr("x", function(d) { return this._x(d.x); }.bind(this))
      .transition()
        .duration(1000)
        .attr("y", function(d) { return Math.ceil(this._y(d.y0 + d.y)); }.bind(this)) // Anti Aliasing on y
        .attr("height", function(d) { return Math.floor(this._y(d.y0) - this._y(d.y0 + d.y)); }.bind(this)); // Anti Aliasing on height

    // enter behaviour
    this._rects.enter()
      .append("rect")
      .attr("class", "bar") // required so that subsequent selections have something to grab on to
      .attr("x", function(d) { return this._x(d.x); }.bind(this))
      .attr("y", function(d) { return Math.ceil(this._y(d.y0)); }.bind(this)) // Anti Aliasing on y
      .attr("width", Math.floor(this._x.rangeBand())) // AA on width
      .attr("height", 0)
      .transition()
        .delay(1000)
        .duration(1000)
        .attr("y", function(d) { return Math.ceil(this._y(d.y0 + d.y)); }.bind(this)) // Anti Aliasing on y
        .attr("height", function(d) { return Math.floor(this._y(d.y0) - this._y(d.y0 + d.y)); }.bind(this)); // Anti Aliasing on height

    // enter + update


    // exit behaviour
    this._rects.exit()
      .each(function() {console.log('test');})
      .transition()
        .duration(1000)
        .attr("y", function(d) { return Math.ceil(this._y(d.y0)); }.bind(this)) // Anti Aliasing on y
        .attr("height", function(d) { return Math.floor(this._y(d.y0) - this._y(d.y0 + d.y)); }.bind(this)) // Anti Aliasing on height
       ;

    

  },


  _convertBetsToStackData:function(betCollection){
    return _.map(betCollection, function(bet){
      return _.map(d3.range(1, 101),function(i){
        var inRange = (i >= bet.rangeMin) && (i <= bet.rangeMax);
        var amountPerNumber = intToBtc(bet.amount / (bet.rangeMax - bet.rangeMin + 1));
        return {
          x: i,
          y: inRange ? amountPerNumber : 0
        };
      });
    });
  },


  _getXTickValues: function() {
    var modulo;
    if (this._chartWidth > 1600) {
      modulo = 1;
    } else if (this._chartWidth > 400) {
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

});

