var $betSlider;
var $betGraph;

var windowLoaded = false;
var templateRendered = false;

var saveBetRange = function(min, max){
  var vals = $betSlider.rangeSlider("values");
  
  Session.set("betSlider.range", vals);
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

var initBetGraph = function(){
  if($betGraph.data("btoStackedBetGraph")){
    $betGraph.stackedBetGraph("draw");

  }else{
    $betGraph.stackedBetGraph();

    Deps.autorun(function(){
      $betGraph.stackedBetGraph("bets", Collections.Bets.find().fetch());
    });
  }
}

// setInterval(function() {
//   $betGraph.stackedBetGraph("bet");
// }, 3000);

// setInterval(function() {
//   $betGraph.stackedBetGraph("revoke");
// }, 8000);


var initPlugins = function(){
  initBetSlider(); 
  initBetGraph();
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

Template.betInput.helpers({
  activeBet: function(){
    return Meteor.user() && Collections.Bets.findOne({playerId: Meteor.user()._id});
  },
  betAmount: function(){
    var bet = Meteor.user() && Collections.Bets.findOne({playerId: Meteor.user()._id});

    return bet ? intToBtc(bet.amount) : 0;
  } 
});

Template.betInput.events({
  "click .bet-btn, click .update-btn":function(){
    var amount = $("input.stake").val() || 0;
    var range = Session.get("betSlider.range");
    
    Meteor.call("submitBet", btcToInt(amount), range.min, range.max);
  },
  "click .revoke-btn": function(){
    Meteor.call("revokeBet");
  } 
});

