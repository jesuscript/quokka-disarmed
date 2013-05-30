var $betSlider;
var $betGraph;
var windowLoaded = false;
var templateRendered = false;

var saveBetRange = function(min, max){
  var vals = $betSlider.rangeSlider("values");
  
  Session.set("betRange", {
    min: vals.min,
    max: vals.max
  });
}

var initBetSlider = function(){
  if($betSlider.data("uiRangeSlider")){
    $betSlider.rangeSlider("resize");
  }else{
    $betSlider.rangeSlider({
      bounds:{min:1, max: 100},
      wheelMode: "zoom",
      step: 1
    }).on("valuesChanging", function(){
      saveBetRange();
    });

    saveBetRange();
  }
};

var initPlugins = function(){
  initBetSlider(); 
  BetGraph.init($betGraph);
};

Template.betInput.rendered = function(){
  $betSlider = $(this.find(".bet-slider"));
  $betGraph = $(this.find(".bet-graph"));
  templateRendered = true;

  if(windowLoaded) initPlugins(); // otherwise init in window load callback
};

$(window).load(function(){
  windowLoaded = true;

  if(templateRendered) initPlugins(); //i'm sure there must be a better way to do this...
});

