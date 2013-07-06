$.widget("bto.stackedBetGraph",$.bto.betGraph,{
  
  obets: [],
  valueArray: [],
  rootContainer: '',


  _create: function(){
    this._super();
    
    $(window).resize(_.debounce(this.draw.bind(this), 5));
    
    this._stack = d3.layout.stack();

    this.draw();
  },


  draw: function() {

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

    y.domain([0, d3.max(this.valueArray, function(d) { return d.frequency; })]);

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
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return chartHeight - y(d.frequency); })
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

    y.domain([0, d3.max(this.valueArray, function(d) { return d.frequency; })]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(3);

    this.rootContainer.select(".y.axis").transition().call(yAxis);

    this.rootContainer.selectAll(".bar")
        .data(this.valueArray)
        .transition()
        .duration(500)
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return chartHeight - y(d.frequency); })
  },


  bet: function() {
    var rAmount1 = this.getRandomInt(1, 100);
    var rAmount2 = this.getRandomInt(rAmount1, 100);
    console.dir(this.obets);
    this.obets.push({"username": this.generateRandomName(), "num1": rAmount1, "num2": rAmount2});
    this.recalculateBets();
    this.redraw();
  },


  revoke: function() {
    this.obets.splice(Math.floor(Math.random() * this.bets.length), 1);
    this.recalculateBets();
    this.redraw();
  },


  generateRandomName: function() {
    var name_list = [ 'al_capone', 
                      'angelo_bruno',
                      'anthony_corallo',
                      'attilio_messina',
                      'baby_face_nelson',
                      'bernard_weinstein',
                      'bugs_moran',
                      'bugsy_siegel'];
    var random_index = Math.floor(Math.random() * name_list.length);
    var random_number = Math.floor(Math.random() * 9999);
    return name_list[random_index] + random_number;
  },


  // creates value array to populate graph
  recalculateBets: function() {
    var convertedBets = [];

    for (var i = this.obets.length - 1; i >= 0; i--) {
      for (var j = this.obets[i].num2; j >= this.obets[i].num1; j--) {
        convertedBets.push( {"username": this.obets[i].username, "num": j} );
      }
    };

    this.valueArray = [];
  
    for (var i = 1; i<=100; i++) {
      var freq = 0;
      for (var j = convertedBets.length - 1; j >= 0; j--) {
        if (convertedBets[j].num == i) freq++;
      };
      this.valueArray.push( {"num": i, "frequency": freq} );
    }
  },


  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

});

