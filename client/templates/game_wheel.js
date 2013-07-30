/*global Meteor, Deps, Collections, Template, $ */

var $betWheel;
var windowLoaded = false; // we really need to find
var templateRendered = false; // a better way of doing this

var timerId;
var calculateLag = function(game){
  if (game && game.startedAt) {
    var latencyTestStart = (new Date()).getTime();
    Meteor.call('getServerTime', function(error, serverTime) {
      roundTripLatency = (new Date()).getTime() - latencyTestStart;
      latency = (!isNaN(roundTripLatency/2)) ? (roundTripLatency/2) : 0;
      serverTime = serverTime;
      calculateTimerState(game, serverTime, latency);
    });

  } else { // timer interupted

    if (timerId) {
      $betWheel.wheelBetGraph("killTimer");
      Meteor.clearInterval(timerId);
      timerId = undefined;
    }

  }

};


var calculateTimerState = function(game, serverTime, latency){
  if (!timerId) {
    var leftOnTimer = serverTime - game.startedAt + latency/2;
    var timerValue = Math.round((BTO.TIMER_GAME_DURATION - leftOnTimer)/1000); 

    timerId = Meteor.setInterval(function(){
      $betWheel.wheelBetGraph("redrawTimer", timerValue);
      timerValue = timerValue - 1;
    },1000);
  }
};


var betsDep;
var gamesDep;

var initBetWheel = function(){
  if(!$betWheel.data("btoWheelBetGraph")){
    $betWheel.wheelBetGraph();
    
    betsDep && betsDep.stop();
    betsDep = Deps.autorun(function(){
      $betWheel.wheelBetGraph("redraw", Collections.Bets.find().fetch());
    });
    
    gamesDep && gamesDep.stop();
    gamesDep = Deps.autorun(function(){
      // also pickups changes in game state, such as started at. This is fine and by design.
      // we could change it to an observer pattern
      calculateLag(Collections.Games.findOne({completed: false})); 
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


