// ideally we should convert this into a plugin, but good as is for now

BetGraph = {
  init:function($el){
    this.$el = $el;
    
    // define bets 'collection'
    var bets = [
      {"username": "t1", "num1": 1, "num2": 4} ,
      {"username": "t2", "num1": 2, "num2": 4} ,
      {"username": "t3", "num1": 3, "num2": 4} ,
      {"username": "t4", "num1": 4, "num2": 4} ,
      {"username": "t5", "num1": 5, "num2": 6} ,
      {"username": "t6", "num1": 20, "num2": 20} ,
      {"username": "t7", "num1": 15, "num2": 12} ,
      {"username": "t8", "num1": 16, "num2": 100} ,
      {"username": "t9", "num1": 3, "num2": 10} ,
    ];



    // creates value array to populate graph
    var convertedBets = [];

    for (var i = bets.length - 1; i >= 0; i--) {
      for (var j = bets[i].num2; j >= bets[i].num1; j--) {
        convertedBets.push( {"username": bets[i].username, "num": j} );
      }
    };

    valueArray = [];

    for (var i = 1; i<=100; i++) {
      var freq = 0;
      for (var j = convertedBets.length - 1; j >= 0; j--) {
        if (convertedBets[j].num == i) freq++;
      };
      valueArray.push( {"num": i, "frequency": freq} );
    }


    var svg = d3.select($el[0]).append("svg");

    this.draw(svg);

    $(window).resize(_.debounce(this.draw.bind(this, svg), 15));
  },
  
  draw: function(svg) {
    var margin = {top: 40, right: 15, bottom: 30, left: 25};
    var targetWidth = this.$el.width();
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

    y.domain([0, d3.max(valueArray, function(d) { return d.frequency; })]);

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


    svg.selectAll("g").remove();
    svg.selectAll(".bar").remove();
    
    rootContainer = svg.attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    rootContainer.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + titleShift + "," + chartHeight + ")")
      .call(xAxis);

    rootContainer.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Live Bets");

    rootContainer.selectAll(".bar")
      .data(valueArray)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.num); })
      .attr("width", barWidth)
      .attr("transform", "translate(" + (titleShift - (barWidth/2)) + ",0)")
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return chartHeight - y(d.frequency); })
    // .transition()
    //   .duration(1000)
    //   .attr("y", function(d) { return height - y(d.frequency) - .5; })
    //   .attr("height", function(d) { return y(d.frequency); });
  }
};

