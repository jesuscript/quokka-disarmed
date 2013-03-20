Meteor.startup(function(){
  BetSlider = $("#bet-slider").rangeSlider({
    bounds:{min:1, max: 100},
    wheelMode: "zoom"
  });
})
