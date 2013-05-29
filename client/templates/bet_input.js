Template.betInput.rendered = function () {

  var self = this;
  self.node = self.find("#bet-graph");


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



  // measures and scales
  var margin = {top: 90, right: 20, bottom: 30, left: 30},
      width = 800 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom,
      titleShift = 18;

  var x = d3.scale.linear()
      .domain([1, 100])
      .range([0, width-titleShift]);

  var y = d3.scale.linear()
      .range([height, 0]);

  function getXTickValues() {
    var theArray = [1];
    for (var i = 1; i <= 100; i++) {
      if (i % 5 === 0  ) theArray.push(i);
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


  console.log(self.node);
  // draw SVG
  var svg = d3.select(self.node).append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", "0 0 " + (width + margin.left + margin.right + titleShift) + " " + (height +  margin.top + margin.bottom) + "")
      .attr("preserveAspectRatio", "none")
      .style("border", "1px solid black")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    y.domain([0, d3.max(valueArray, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + titleShift + "," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Live Bets");

    svg.selectAll(".bar")
        .data(valueArray)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.num); })
        .attr("width", 6)
        .attr("transform", "translate(" + titleShift + ",0)")
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); });


}