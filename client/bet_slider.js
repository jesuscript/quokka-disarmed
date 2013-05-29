Meteor.startup(function(){
  var $betSlider = $("#bet-slider").rangeSlider({
    bounds:{min:1, max: 100},
    wheelMode: "zoom",
  }).on("valuesChanging", saveValues);

  function saveValues(e, data){
    if(!$betSlider.length) return;
    
    var vals = data ? data.values : $betSlider.rangeSlider("values");

    if(vals.min > vals.max){ // fixing a glitch in rangeSLider
      vals.min = vals.max;
      $betSlider.rangeSlider("values", vals.max, vals.max);
    }

    vals.min = Math.round(vals.min);
    vals.max = Math.round(vals.max);
    
    Session.set("bet_slider", $.extend(Session.get("bet_slider"),{
      values: vals
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

