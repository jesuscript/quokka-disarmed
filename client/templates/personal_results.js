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
  $luckyNum = $(this.find("#lucky-num"));
  createCounter(50, 800, function () {
    $luckyNum.addClass("pulsate");
  });
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

    if(Meteor.user()){
      payout = Collections.Payouts.findOne({gameId: lastGame._id, playerId: Meteor.user()._id});
    }

    return {
      luckyNum: lastGame ? lastGame.luckyNum : "",
      payout: payout ? intToBtc(payout.payout) : 0
    };
  }
});

Template.personalResults.events({
  "click #skipTimer": function(e){
    e.preventDefault();
    Session.set("displayResults", false);
  }
});