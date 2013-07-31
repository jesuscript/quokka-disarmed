var createCounter = function(theNum, totalTime, callback) {
  var interval = totalTime / 20;
  var intervalId;
  var firstStep = 0;
  var lastStep = 20;

  var f = function () {
    var randNum = Math.round(Math.random() * 100);
    $luckyNum.text(randNum);
    if (firstStep === lastStep) {
      $luckyNum.text(theNum);
      clearInterval(intervalId);
      if (callback) callback();
    }
    ++firstStep;
  };

  intervalId = setInterval(f, interval);
};


var createBackToGameTimer = function(totalTime) { 
  var interval = totalTime / 10;
  var intervalId;
  var firstStep = 10;
  var lastStep = 0;

  var f = function () {
    $timer.text("Back to game in: " + firstStep);
    if (firstStep === lastStep) {
      clearInterval(intervalId);
    }
    --firstStep;
  };

  intervalId = setInterval(f, interval);
};


Template.personalResults.rendered = function(){
  $luckyNum = $(this.find("#lucky-num"));
  $timer = $(this.find("#timer-back-to-game"));
  createBackToGameTimer(BTO.TIMER_BACKTOGAME);
};


Template.personalResults.helpers({
  backToGameTimer: function(remainingTime){
    return remainingTime;
  },
  results: function(){
    var lastGame = Collections.Games.findOne({completed: true}, {sort: {completedAt: -1}});
    var gameResult, win;

    if(!lastGame || !Meteor.userId()) return {};

    gameResult = Collections.GameResults.findOne({
      gameId: lastGame._id,
      playerId: Meteor.userId()
    });

    win = gameResult ? gameResult.payout - gameResult.stake : 0;

    if(win<0) win = 0;

    createCounter(lastGame.luckyNum , BTO.TIMER_ROLL_DURATION, function () {
      $luckyNum.addClass("pulsate");
    });

    return {
      win:  intToBtc(win)
    };
  }
});


Template.personalResults.events({
  "click #skipBtn": function(e){
    e.preventDefault();
    Session.set("displayResults", false);
  }
});
