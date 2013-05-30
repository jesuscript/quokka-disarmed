var $betSlider;
var windowLoaded = false;

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

Template.betInput.rendered = function(){
  $betSlider = $(this.find(".bet-slider"));

  if(windowLoaded) initBetSlider(); // otherwise render in window load callback
};

$(window).load(function(){
  windowLoaded = true;

  if($betSlider) initBetSlider();
});
