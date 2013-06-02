// var $gameWheel;
// var windowLoaded = false;
// var templateRendered = false;

// var initPlugins = function(){
//   GameWheel.init($gameWheel);
// };

// Template.gameWheel.rendered = function(){
//   $gameWheel = $(this.find("#game-wheel"));
//   templateRendered = true;

//   if(windowLoaded) initPlugins(); // otherwise init in window load callback

//   setInterval(function() {
//     GameWheel.bet();
//   }, 3000);

//   setInterval(function() {
//     GameWheel.revoke();
//   }, 8000);

// };

// $(window).load(function(){
//   windowLoaded = true;
//   if(templateRendered) initPlugins(); //i'm sure there must be a better way to do this...
// });

Template.gameWheel.rendered = function(){

  function bet() {
    var rAmount = getRandomArbitrary(0.00001, 1);
    bets.push({"username": generateRandomName(), "amount": rAmount});
    draw();
  }

  function revoke() {
    var randomIndex = Math.floor(Math.random() * bets.length);
    bets.splice(randomIndex, 1);
    draw();
  }

  function generateRandomName() {
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
  }; 

  function getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomArbitrary (min, max) {
      return Math.random() * (max - min) + min;
  }

  var bets = [
    {"username": "t1", "amount": 0.101} ,
    {"username": "t2", "amount": 0.022} ,
    {"username": "t3", "amount": 0.303} ,
    {"username": "t4", "amount": 0.504} ,
    {"username": "t5", "amount": 0.005}
  ];


  var svgHeight = 250;
  var bankRadius = svgHeight/2;
  var innerRadius = bankRadius-20;


  var enterAntiClockwise = {
    startAngle: Math.PI * 2,
    endAngle: Math.PI * 2
  };

  var color = d3.scale.category20();

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.amount; });

  var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(bankRadius);

  var svg = d3.select("#game-wheel").append("svg")
    .attr("viewBox", "0 0 250 250")
    .attr("preserveAspectRatio", "XmidYmid")
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + svgHeight / 2 + "," + svgHeight / 2 + ")");

  var centerGroup = svg.append("g")
    .attr("class", "center-group");

  var whiteCircle = centerGroup.append("circle")
    .attr("fill", "white")
    .attr("r", innerRadius);

  var totalLabel = centerGroup.append("text")
    .attr("class", "label")
    .attr("dy", -15)
    .attr("text-anchor", "middle")
    .text("BANK");

  var totalValue = centerGroup.append("text")
    .attr("class", "total")
    .attr("dy", 7)
    .attr("text-anchor", "middle")
    .text("Loading bets...");

  var totalUnits = centerGroup.append("text")
    .attr("class", "units")
    .attr("dy", 21)
    .attr("text-anchor", "middle")
    .text("BTC");


  var path = svg.selectAll("path");

  setInterval(function() {
    bet();
  }, 3000);

  setInterval(function() {
    revoke();
  }, 8000);


  draw();



  function draw() {

    var array = bets;
    var cumulative = 0;
    var sums = _.map(array,function(num){ 
        cumulative += num.amount;
    });

    totalValue
      .text(cumulative.toFixed(8))
      .transition()
        .duration(750)
        .attr("x", function(d, i) { return i * 32; });

    path = path.data(pie(bets), function (d) {return d.data.username;});
    path.enter().append("path")
        .attr("fill", function (d, i) {
          return color(i);
        })
        .attr("d", arc(enterAntiClockwise))
        .each(function (d) {
          this._current = {
            data: d.data,
            value: d.value,
            startAngle: enterAntiClockwise.startAngle,
            endAngle: enterAntiClockwise.endAngle
          };
        })
        .call(d3.helper.tooltip()
        .style({'text-align':'center', 'font-size': '12px', 'line-height': '20px','padding': '4px 12px 4px 16px', 'background': 'rgba(0, 0, 0, 0.8)', 'color': '#fff', 'border-radius': '2px', 'font-family': 'Helvetica Neue, Helvetica, Arial, sans-serif'})
        .text(function(d, i) { return d.data.username  + '<br> BTC ' + d.value.toFixed(8); })
      );

    path.exit()
        .transition()
        .duration(750)
        .attrTween('d', arcTweenOut)
        .remove()

    path.transition().duration(750).attrTween("d", arcTween);
  }

  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  }

  function arcTweenOut(a) {
    var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
    this._current = i(0);
    return function (t) {
      return arc(i(t));
    };
  }

};