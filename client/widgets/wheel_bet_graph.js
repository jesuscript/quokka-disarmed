$.widget("bto.wheelBetGraph",$.bto.betGraph,{

  options:{
    svgHeight: 250
  },

  _create: function(){
    this._super();

    // properties (instance) definitions, jquery widget requires for them to be located here
    this._bankRadius = this.options.svgHeight/2;
    this._innerRadius = this._bankRadius-15;

    this._createSvg();

    this._draw();
  },


  _createSvg: function(){
    var svgHeight = this.options.svgHeight;

    this._svg = d3.select(this.element[0]).append("svg")
      .attr("viewBox", "0 0 250 250") // <min-x> <min-y> <width> <height>
      .attr("preserveAspectRatio", "XmidYmid")
      .attr("height", svgHeight)
      .append("g")
        .attr("transform", "translate(" + svgHeight / 2 + "," + svgHeight / 2 + ")");
  },


  _draw: function(){
    this._setColorRange();

    this._pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.amount; }); // key

    this._arc = d3.svg.arc()
      .innerRadius(this._innerRadius)
      .outerRadius(this._bankRadius);



    this._centerGroup = this._svg.append("g")
      .attr("class", "center-group");

    this._whiteCircle = this._centerGroup.append("circle")
      .attr("fill", "white")
      .attr("r", this._innerRadius);

    this._totalLabel = this._centerGroup.append("text")
      .attr("class", "label")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .text("BANK");

    this._totalValue = this._centerGroup.append("text")
      .attr("class", "total")
      .attr("dy", 7)
      .attr("text-anchor", "middle")
      .text("Loading bets...");

    this._totalUnits = this._centerGroup.append("text")
      .attr("class", "units")
      .attr("dy", 21)
      .attr("text-anchor", "middle")
      .text("BTC");

  },
  

  redraw: function(betCollection){
    if(betCollection){
      this._d3data = this._convertBetsToWheelData(betCollection)
      this._updateTotalValue();
      this._wheelDefineD3Sequence();
    }
  },


  _convertBetsToWheelData:function(betCollection){
    return _.map(betCollection, function(bet){
      return {
          playerName: bet.playerName,
          amount: intToBtc(bet.amount)
        };
    });
  },


  _updateTotalValue: function(){
    var cumulative = _.reduce(this._d3data,function(memo,num){ 
      return memo + num.amount;
    },0,this);
    
    this._totalValue
      .text(cumulative)
      .transition()
        .duration(750)
        .attr("x", function(d, i) { return i * 32; });
  },


  _wheelDefineD3Sequence: function(){
    enterAntiClockwise = {
      startAngle: Math.PI * 2,
      endAngle: Math.PI * 2
    };

    this._path = this._svg.selectAll("path");

    this._pathData = this._path
      .data(this._pie(this._d3data), function (d) { return d.data.playerName; });

    this._pathData.enter().append("path")
      .attr("fill", function (d, i) { return this._colorRange(i); }.bind(this))
      .attr("d", this._arc(enterAntiClockwise))
      .each(function (d) {
        this._current = {
          data: d.data,
          value: d.value,
          startAngle: enterAntiClockwise.startAngle,
          endAngle: enterAntiClockwise.endAngle
        };
      }).call(
        d3.helper.tooltip()
          .style({
            'text-align':'center',
            'font-size': '12px',
            'line-height': '20px',
            'padding': '4px 12px 4px 16px',
            'background': 'rgba(0, 0, 0, 0.8)',
            'color': '#fff',
            'border-radius': '2px',
            'font-family': 'Helvetica Neue, Helvetica, Arial, sans-serif'
          }).text(function(d, i) { return d.data.playerName + '<br> BTC ' + d.value; })
      );

    this._pathData.exit()
      .transition()
        .duration(750)
        .attrTween('d', this._getArcTweenOutFunction())
      .remove();

     this._pathData
      .transition()
        .duration(750)
        .attrTween("d", this._getArcTweenFunction());

  },


  _getArcTweenFunction: function() {
    var arc = this._arc;
    
    return function(a){
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      
      return function(t) {
        return arc(i(t));
      };
    };
  },


  _getArcTweenOutFunction: function() {
    var arc = this._arc;
    
    return function(a){
      var i = d3.interpolate(this._current, {
        startAngle: Math.PI * 2,
        endAngle: Math.PI * 2, value: 0
      });

      this._current = i(0);
      
      return function (t) {
        return arc(i(t));
      };
    };
  }
});
