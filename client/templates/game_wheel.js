var $betWheel;
var windowLoaded = false; // we really need to find
var templateRendered = false; // a better way of doing this

var initBetWheel = function(){
  if(!$betWheel.data("btoWheelBetGraph")){
    $betWheel.wheelBetGraph();
    Deps.autorun(function(){
      $betWheel.wheelBetGraph("redraw", Collections.Bets.find().fetch());
    });
  }
};

Template.gameWheel.rendered = function(){
  $betWheel = $(this.find(".bet-wheel"));
  templateRendered = true;
  if(windowLoaded) initBetWheel();
};

$(window).load(function(){
  windowLoaded = true;
  if(templateRendered) initBetWheel();
});


Template.gameWheel.helpers({
  justFinished: function(){
    justFinished =  Collections.Games.find({
      completed: true,
      completedAt: {$gt: (new Date()).getTime() - 5000 }
    }).count();

    setTimeout(function(){ Session.set("game_wheel_just_finished"); },5001);

    if(justFinished) Session.set("game_wheel_just_finished", true);
    
    return !!justFinished && Session.get("game_wheel_just_finished");
  },
  results: function(){
    var lastGame = Collections.Games.findOne({completed: true}, {sort: {completedAt: -1}});
    var payout;

    if(Meteor.user()){
      payout = Collections.Payouts.findOne({gameId: lastGame._id, playerId: Meteor.user()._id});
    }

    return {
      luckyNum: lastGame ? lastGame.luckyNum : "",
      payout: payout ? intToBtc(payout.payout) : 0
    };
  }
});
