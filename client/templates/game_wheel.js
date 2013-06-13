var $betWheel;
var windowLoaded = false; // we really need to find
var templateRendered = false; // a better way of doing this

var initBetWheel = function(){
  if($betWheel.data("btoWheelBetGraph")){
    $betWheel.wheelBetGraph("draw");
  }else{
    $betWheel.wheelBetGraph();

    Deps.autorun(function(){
      $betWheel.wheelBetGraph("bets", Collections.Bets.find().fetch());
    });
  }
}

Template.gameWheel.rendered = function(){
  $betWheel = $(this.find(".bet-wheel"));
  templateRendered = true;

  if(windowLoaded) initBetWheel();
};

$(window).load(function(){
  windowLoaded = true;

  if(templateRendered) initBetWheel();
});
