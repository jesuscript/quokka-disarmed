Meteor.startup(function(){
  var $betSlider = $("#bet-slider").rangeSlider({
    bounds:{min:1, max: 100},
    wheelMode: "zoom",
    step: 1
  }).on("valuesChanging", saveValues);

  function saveValues(e, data){
    Session.set("bet_slider", $.extend(Session.get("bet_slider"),{
      values: data ? data.values : $betSlider.rangeSlider("values")
    }));
  }

  saveValues();
});

BetSlider = {};
BetSlider.getSliderVals = function() {
  var bet_slider = Session.get("bet_slider");
  
  if(bet_slider && bet_slider.values){
    return bet_slider.values;
  }
  
  return undefined;
}

