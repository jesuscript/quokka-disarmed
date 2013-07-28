var createCounter = function(theNum, totalTime, callback) {
  var interval = totalTime / 20;
  var intervalId;
  var firstStep = 0;
  var lastStep = 20;

  var f = function () {
    var randNum = Math.round(Math.random() * 100);
    $luckyNum.text(randNum);
    if (firstStep == lastStep) {
      $luckyNum.text(theNum);
      clearInterval(intervalId);
      if (callback) callback();
    }
    ++firstStep;
  } 

  intervalId = setInterval(f, interval);
}


var createBackToGameTimer = function(totalTime) { 
  var interval = totalTime / 10;
  var intervalId;
  var firstStep = 10;
  var lastStep = 0;

  var f = function () {
    $timer.text("Back to game in: " + firstStep);
    if (firstStep == lastStep) {
      clearInterval(intervalId);
    }
    --firstStep;
  } 

  intervalId = setInterval(f, interval);
}


Template.personalResults.rendered = function(){
  console.log("rerender da biatch");
  $luckyNum = $(this.find("#lucky-num"));
  $timer = $(this.find("#timer-back-to-game"));
  createBackToGameTimer(10000);
};


Template.personalResults.helpers({
  backToGameTimer: function(remainingTime){
    return remainingTime;
  },
  results: function(){
    var lastGame = Collections.Games.findOne({completed: true}, {sort: {completedAt: -1}});
    var payout;

    if(!lastGame) return;

    if(Meteor.userId()){
      payout = Collections.Payouts.findOne({gameId: lastGame._id, playerId: Meteor.userId()});
    }

    createCounter(lastGame.luckyNum , 800, function () {
      $luckyNum.addClass("pulsate");
    });

    return { payout: payout ? intToBtc(payout.payout) : 0 };
  }
});


Template.personalResults.events({
  "click #skipBtn": function(e){
    e.preventDefault();
    Session.set("displayResults", false);
  }
});