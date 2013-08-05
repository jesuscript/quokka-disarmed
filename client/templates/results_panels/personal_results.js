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
  var processingTime = 1; // takes one second for the full screen to render correctly
  var firstStep = 10 - processingTime;
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
    var lastGame = Collections.Games.findOne({completed: true}, {sort: {completedAt: -1}}); // to retrieve lucky num and publicSeq
    var personalResult, hasWon, outcome;

    createCounter(lastGame.luckyNum , BTO.TIMER_ROLL_DURATION, function () {
      $luckyNum.addClass("pulsate");
    });

    if(!Meteor.userId()) return { publicSeq: lastGame.publicSeq }; // observers only see publicSeq and luckyNum

    personalResult = Collections.GameResults.findOne({ playerId: Meteor.userId() });

    if (!personalResult) return { publicSeq: lastGame.publicSeq };

    hasWon = (personalResult.won <= 0) ? hasWon = false : hasWon = true;
    outcome = (personalResult.won === 0) ? 0 : intToBtc(Math.abs(personalResult.won)); // this should really be in a helper

    return {
      hasPlayed: true,
      hasWon: hasWon,
      outcome: outcome, // won can be negative!
      publicSeq: lastGame.publicSeq,
      stake: personalResult.stake,
      payout: personalResult.payout
    };
  }
});


Template.personalResults.events({
  "click #skipBtn": function(e){
    e.preventDefault();
    Session.set("displayResults", false);
  }
});
