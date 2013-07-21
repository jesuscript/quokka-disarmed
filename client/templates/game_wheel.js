var $betWheel;
var windowLoaded = false; // we really need to find
var templateRendered = false; // a better way of doing this

var calculateLag = function(game){
  var latencyTestStart = (new Date).getTime();
  Meteor.call('getServerTime', function(error, serverTime) {
    roundTripLatency = (new Date).getTime() - latencyTestStart;
    latency = (!isNaN(roundTripLatency/2)) ? (roundTripLatency/2) : 0;
    serverTime = serverTime;
    calculateTimerState(game, serverTime, latency);
  });
}


var timerId;
var calculateTimerState = function(game, serverTime, latency){
  if(game) { 
    if (game.startedAt) {

      if (!timerId) {
        var leftOnTimer = serverTime - game.startedAt + latency/2;
        var timerValue = x_rounded = Math.round((60000 - leftOnTimer)/1000);

        timerId = Meteor.setInterval(function(){
          $betWheel.wheelBetGraph("redrawTimer", timerValue);
          timerValue = timerValue - 1;
        },1000);
      };
    
    } else {

      if (timerId) {
        $betWheel.wheelBetGraph("killTimer");
        Meteor.clearInterval(timerId);
        timerId = undefined;
      }

    }
  }
};


var initBetWheel = function(){
  if(!$betWheel.data("btoWheelBetGraph")){
    $betWheel.wheelBetGraph();
    Deps.autorun(function(){
      $betWheel.wheelBetGraph("redraw", Collections.Bets.find().fetch());
    });
    Deps.autorun(function(){
      calculateLag(Collections.Games.findOne({completed: false}));
    });       
  }
};


Template.gameWheel.rendered = function(){
  // console.log('rendered template');
  $betWheel = $(this.find(".bet-wheel"));
  templateRendered = true;
  if(windowLoaded) initBetWheel();
};

$(window).load(function(){
  // console.log('window loaded');
  windowLoaded = true;
  if(templateRendered) initBetWheel();
});


Template.gameWheel.helpers({
  justFinished: function(){
    justFinished =  Collections.Games.find({
      completed: true,
      completedAt: {$gt: (new Date()).getTime() - 10000 }
    }).count();

    setTimeout(function(){ Session.set("game_wheel_just_finished"); }, 10001);

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
