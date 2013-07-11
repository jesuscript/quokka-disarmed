$.widget('bto.stackedBetGraph',$.bto.betGraph,{
  
  _create: function(){
    console.log('stackedBetGraph create()');
    this._super();

    // properties definitions
    // this._chartWidth and this._chartHeight refer to the drawn area on the chart. The rest are margins so we don't overdraw
    this._yAxisLabelShift = 15; // shift everything to the right to give room for the y axis label to be readable
    this._margin = {top: 10, right: 15, bottom: 18, left: 40}; // using standard d3 margin definitions by attaching all elements to a bounding box
    this._chartHeight = 150 - this._margin.top - this._margin.bottom;

    $(window).resize(_.debounce(this._draw.bind(this), 10));

    this._svg = d3.select(this.element[0]).append('svg');

    // this._draw();
  },


  _draw: function() {
    console.log('draw() invoked()');

    this._setColorRange();

    this._chartWidth = this.element.width() - this._margin.left - this._margin.right - this._yAxisLabelShift;

    this._layers = d3.layout.stack()(this._d3data); // calculate x, y0 and y for each series
    
    this._yStackMax = d3.max(this._layers, function(layer) {
      return d3.max(layer, function(d) { return d.y0 + d.y; }); // highest y0 + y == top most point on chart
    });

    var x = d3.scale.ordinal()
          .domain(d3.range(1,101))
          .rangeBands([0, this._chartWidth], .3); // roundRangeBands creates significant rounding errors leading to a squeezed graphic

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickValues(this._getXTickValues()) // rescale x axis so tick labels don't overlap
      .tickSubdivide(true) // unstable, doesn't seem to always work, known bug
      .tickSize(6,3,0); // remove end ticks to avoid

    var y = d3.scale.linear()
      .domain([0, this._yStackMax])
      .range([this._chartHeight, 0]);

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(6,3,0) // remove end ticks to avoid
      .tickFormat(d3.format(".2s"));

    //this._svg.selectAll("g").remove(); // don't remove entire SVG - just the groups (will kill off children nodes)

    this._chartArea = this._svg
      .append('g')
        .attr('transform', 'translate(' + this._margin.left + ',' + this._margin.top + ')'); // new root coords at top left corner of margins

    this._chartArea.append('g')
      .attr("class", "x axis")
      .attr("transform", "translate(" + this._yAxisLabelShift + "," + this._chartHeight + ")")
      .call(xAxis);

    this._chartArea.append("g")
      .attr("class", "y axis")
      .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("BTC");

    // create a g with a specific color for each bettor
    this._series = this._chartArea.selectAll(".series")
      .data(this._layers)
      .enter()
      .append("g")
        .attr("class", "series")
              .attr("transform", "translate(" + this._yAxisLabelShift + ",0)")
        .style("fill", function(d, i) {
          return this._colorRange(i);
        }.bind(this));

    this._series.selectAll("rect")
      .data(function(d) { return d; })
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", this._chartHeight)
      .attr("width", Math.floor(x.rangeBand())) // AA on width
      .attr("height", 0)
      .transition()
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return Math.ceil(y(d.y0 + d.y)); }) // Anti Aliasing on y
        .attr("height", function(d) { return Math.floor(y(d.y0) - y(d.y0 + d.y)); }); // Anti Aliasing on height
  },


  redraw: function(betCollection) {
    console.log('redraw invoked');
    if (betCollection && betCollection.length) {
      this._d3data = this._convertBetsToStackData(betCollection);
      this._draw();
    }
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

