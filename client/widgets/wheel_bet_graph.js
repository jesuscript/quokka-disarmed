$.widget("bto.wheelBetGraph",$.bto.betGraph,{
  //draw is working but currently adding / revoking bets is broken. 
  
  options:{
    svgHeight: 250
  },
  _create: function(){
    this._super();

    this._createSvg();
    this.draw();
  },
  draw: function(){
    this._setColorRange();
    this._createLayout();
    this._createPath();
  },
  bets: function(bets){
    if(bets){
      this._bets = bets;
      this._createPath();
      this._updateTotalValue();
    }
    return this._bets;
  },
  users: function(users){
    if(users){
      this._users = users;
    }

    return this._users;
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
  _createLayout: function(){
    this._bankRadius = this.options.svgHeight/2;
    this._innerRadius = this._bankRadius-20;
    
    this._pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.amount; });

    this._arc = d3.svg.arc()
      .innerRadius(this._innerRadius)
      .outerRadius(this._bankRadius);

    this._drawLayoutElements();
  },
  _drawLayoutElements: function(){
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

    this._drawTotalValue();

    this._totalUnits = this._centerGroup.append("text")
      .attr("class", "units")
      .attr("dy", 21)
      .attr("text-anchor", "middle")
      .text("BTC");
  },
  _drawTotalValue: function(){
    this._totalValue = this._centerGroup.append("text")
      .attr("class", "total")
      .attr("dy", 7)
      .attr("text-anchor", "middle")
      .text("Loading bets...");
  },
  _updateTotalValue: function(){
    var cumulative = _.reduce(this._bets,function(memo,num){ 
      return memo + intToBtc(num.amount);
    },0,this);
    
    this._totalValue
      .text(cumulative.toFixed(8))
      .transition()
      .duration(750)
      .attr("x", function(d, i) { return i * 32; });
  },
  _createPath: function(){
    this._updatePathData();
    this._definePathEnter();
    this._definePathExit();

    this._pathData.transition().duration(750).attrTween("d", this._getArcTweenFunction());
  },
  _updatePathData: function(){
    this._pathData = this._svg.selectAll("path").data(this._pie(this._bets), function (d) {
      return d.data.playerId;
    });
  },
  _definePathEnter:function(){
    var enterAntiClockwise = {
      startAngle: Math.PI * 2,
      endAngle: Math.PI * 2
    };
    
    this._pathData.enter().append("path")
      .attr("fill", function (d, i) {
        return this._colorRange(i);
      }.bind(this))
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
          }).text(function(d, i) {//TODO: replace playerId with username
            var user;
            var id = d.data.playerId;

            if(this._users && (user = this._users.findOne({_id: id})) && user.username ){
              user = user.username;
            }else{
              user = id;
            }
              
            return user + '<br> BTC ' + d.value.toFixed(8); 
          }.bind(this))
      );
  },
  _definePathExit: function(){
    this._pathData.exit()
      .transition()
      .duration(750)
      .attrTween('d', this._getArcTweenOutFunction())
      .remove();
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
