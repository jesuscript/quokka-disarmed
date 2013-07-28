/*global Meteor, Deps, Collections, Template, $ */

var $betWheel;
var windowLoaded = false; // we really need to find
var templateRendered = false; // a better way of doing this

var calculateLag = function(game){
  console.log('calculate lag involed');
  var latencyTestStart = (new Date).getTime();
  Meteor.call('getServerTime', function(error, serverTime) {
    var roundTripLatency = (new Date).getTime() - latencyTestStart;
    var latency = (!isNaN(roundTripLatency/2)) ? (roundTripLatency/2) : 0;
    serverTime = serverTime;
    calculateTimerState(game, serverTime, latency);
  });
};


var timerId;
var calculateTimerState = function(game, serverTime, latency){
  if(game) { 
    if (game.startedAt) {

      if (!timerId) {
        var x_rounded;
        var leftOnTimer = serverTime - game.startedAt + latency/2;
        var timerValue = x_rounded = Math.round((10000 - leftOnTimer)/1000);

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

var betsDep;
var gamesDep;


var initBetWheel = function(){
  if(!$betWheel.data("btoWheelBetGraph")){
    console.log('initbetwheel past data check');
    $betWheel.wheelBetGraph();
    
    betsDep && betsDep.stop();

    betsDep = Deps.autorun(function(){
      $betWheel.wheelBetGraph("redraw", Collections.Bets.find().fetch());
    });

    
    gamesDep && gamesDep.stop();
    
    gamesDep = Deps.autorun(function(){
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


