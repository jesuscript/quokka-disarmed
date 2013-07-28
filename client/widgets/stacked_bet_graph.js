$.widget('bto.stackedBetGraph',$.bto.betGraph,{
  
  _create: function(){
    this._super();

    // properties (instance) definitions, jquery widget requires for them to be located here
    // this._chartWidth and this._chartHeight refer to the drawn area on the chart. The rest are margins so axis legend doesn't get clipped
    this._yAxisLabelShift = 15; // shift everything to the right to give room for the y axis label for it not to be covered by the bar on x = 1
    this._margin = {top: 10, right: 15, bottom: 18, left: 40}; // using 'best practice' d3 margin definitions by attaching all elements to a bounding box
    this._chartHeight = 92 - this._margin.top - this._margin.bottom; // chart never resizes vertically
    this._transitionDuration = 800; // time for bars to go up / down, other values recalcuted based on this
    this._previousBetCollection = []; // temporary fix for duplicate autorun trigger bug

    $(window).resize(_.debounce(this._draw.bind(this), 100)); // debouncing at 100 seems to be enough to avoid re-rendering while mouse is still moving

    this._svg = d3.select(this.element[0]).append('svg');

    this._draw();
  },


  _draw: function() {
    this._setColorRange();

    this._chartWidth = this.element.width() - this._margin.left - this._margin.right - this._yAxisLabelShift; // due to lag in rendering this needs to be placed here to be accurate, and not on _create

    this._udpdateStack();

    this._defineAxes();

    this._svg.selectAll("g").remove(); // don't remove entire SVG when redrawing - just the groups (will kill off children nodes)

    this._chartArea = this._svg // define bounding box
      .append('g')
        .attr('transform', 'translate(' + this._margin.left + ',' + this._margin.top + ')'); // new root coords at top left corner of margins

    this._drawNoBetsText();

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
      .tickSize(5,3,1); // major, minor, line thickness

    this._y = d3.scale.linear()
      .domain([0, this._yStackMax])
      .range([this._chartHeight, 0]);

    this._yAxis = d3.svg.axis()
      .scale(this._y)
      .orient("left")
      .ticks(4) // approximate tick count
      .tickSize(4,2,1) // major, minor, line thickness
      .tickFormat(d3.format(".2s"));
  },


  // draw text on graph in case there are no bets. Called both on _draw() and _redraw()
  _drawNoBetsText: function() {
    if ((this._chartArea.select("#no-bets-text").empty()) && (!this._d3data.length)) {
      this._addNoBetsText();
    } else if (this._d3data.length) {
      this._removeNoBetsText();
    }
  },

  _addNoBetsText: function() {
    this._noBetsText = this._chartArea.append("text")
      .attr("id", "no-bets-text")
      .attr("text-anchor", "middle")
      .attr("y", this._chartHeight/2)
      .attr("x", this.element.width()/2)
      .style("font-size","14") // align with rest of site
      .style("fill", "#999")     
      .style("opacity", '0')
      .text("No bet placed")
    .transition()
      .delay(this._transitionDuration) // time for the bars to go all the way down
      .duration(this._transitionDuration)
      .style("opacity", '1')
  },

  _removeNoBetsText: function() {
    this._chartArea.select("#no-bets-text")
    .transition()
      .duration(this._transitionDuration) // disapear by the time the bars are starting climbing (there's a this._transitionDuration ms delay before the bar draw on enter)
      .style("opacity", '0')
    .remove();
  },


  // draw axises. Called once on _draw()
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
    if(betCollection) {
      // With the fix to the subscribe to bets method, this is likely unnecessary. 
      // In time, we'll remove it, however, at this stage we believe it only triggers on empty arrays so is harmless
      var duplicateCallDetected = this._previousBetCollection.compare(betCollection);
      if (!duplicateCallDetected) {
        this._d3data = this._convertBetsToStackData(betCollection);

        this._drawNoBetsText();

        this._udpdateStack();

        this._transitionYAxis();

        this._seriesDefineD3Sequence();

        this._rectDefineD3Sequence();
      } else { 
        // console.log('duplicate autorun output ignored in stacked bet graph');
        // console.dir(betCollection)
      }
    } 
    this._previousBetCollection = betCollection;
  },


  _transitionYAxis:function(){
    this._y.domain([0, this._yStackMax])
    .range([this._chartHeight, 0]);

    this._chartArea.select(".y.axis").transition().duration(2000).call(this._yAxis); // we're making the yaxis 'lag' a bit on purpose for dramatic effect
  },


  _seriesDefineD3Sequence:function(){ 
    // feed data
    this._series = this._chartArea.selectAll(".series") // selections HAVE to be rerun, can't just refer to variable to update
      .data(this._layers)

    // update
    // (nothing to do)

    // enter behaviour
    this._series.enter()
      .append("g")
        .attr("class", "series")
        .attr("transform", "translate(" + this._yAxisLabelShift + ",0)")
        .style("fill", function(d, i) { return this._colorRange(i); }.bind(this));

    // enter + update
    // (nothing to do)

    // exit behaviour
    this._series.exit()
      .transition()
        .duration(this._transitionDuration)
        .style("opacity", '0')
        .remove();
  },


  _rectDefineD3Sequence:function(){ 
    // feed data
    this._rects = this._series.selectAll("rect") // selections HAVE to be rerun, can't just refer to variable to update
      .data(function(d) { return d; })

    // update behaviour
    this._rects
      .attr("x", function(d) { return this._x(d.x); }.bind(this))
      .transition()
        .duration(this._transitionDuration)
        .attr("y", function(d) { return this._y(d.y0 + d.y); }.bind(this)) 
        .attr("height", function(d) { var h = this._y(d.y0) - this._y(d.y0 + d.y) -1; return (h>=0) ? h : 0; }.bind(this)); // -1 for pretty bar bottoms

    // enter behaviour
    this._rects.enter()
      .append("rect")
      .attr("class", "bar") // required so that subsequent selections have something to grab on to
      .attr("x", function(d) { return this._x(d.x); }.bind(this))
      .attr("y", function(d) { return this._y(d.y0); }.bind(this)) 
      .attr("width", this._x.rangeBand()) 
      .attr("height", 0)
      .transition()
        .delay(this._transitionDuration)
        .duration(this._transitionDuration)
        .attr("y", function(d) { return this._y(d.y0 + d.y); }.bind(this)) 
        .attr("height", function(d) { var h = this._y(d.y0) - this._y(d.y0 + d.y) -1; return (h>=0) ? h : 0; }.bind(this)); // -1 for pretty bar bottoms... mmmmm.....

    // enter + update
    // (nothing to do)

    // exit behaviour
    // (rects are not aware of a series exit unfortunately, this must be handled at series level)
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

