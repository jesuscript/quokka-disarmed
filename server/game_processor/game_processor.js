/*global GetRandInt, Meteor, Observe, Collections */

Meteor.startup(function(){
  var gameTimeout = null;

  var processGame = function(){
    var currentGame = DB.currentGame();
    var luckyNum = GetRandInt();
    var bets = DB.bets(currentGame);
    var game = new Quokka(bets);
    var payouts = game.computeResults(luckyNum);
    var decrements = {};
    
    _.each(bets, function(bet){
      decrements[bet.playerId] = - bet.amount;
    });

    _.each(payouts, function(payout, id){
      var player = Meteor.users.findOne({_id: id}, {fields: {username: 1}});
      Collections.Payouts.insert({
        gameId: currentGame._id,
        playerId: id,
        playerName: player.username,
        payout: payout,
        timestamp: (new Date()).getTime()
      });
    });

    _calculateAllTimeStats(payouts);
    _calculateAllTimeWinners(payouts);
    _calculateHotColdNumbersAggregates(luckyNum);
    _calculateHotColdNumbers();

    payouts = game.mergePayouts(payouts, decrements);
    
    _.each(payouts, function(payout, id){
      Meteor.users.update({_id: id},{$inc: {balance: payout}});
    });
    
    Collections.Games.update(currentGame, {$set:{
      completedAt: (new Date()).getTime(),
      completed: true,
      luckyNum: luckyNum
    }});

    DB.activity("The Lucky Number for game #" + currentGame.publicSeq + " is " + luckyNum, "luckyNum");
    // DB.activity("Congratulations to this round's " + winnerCount + " winners", "game"); JD TODO once payout mechanism has been modified
    // DB.activity("฿" + amountDistributed + " distributed this round", "game"); JD TODO once payout mechanism has been modified
    
    var newSeq = (typeof currentGame.publicSeq === "number") ? ++currentGame.publicSeq : 1;
    Collections.Games.insert({
      completed: false,
      publicSeq: newSeq,
      createdAt: (new Date()).getTime()
    });

    DB.activity("New game #" + newSeq + " starts", "game");
  };
  
  
  Observe.currentGame({
    betUpdate: function(){ 
      var currentGame = DB.currentGame();

      if(!currentGame) return;
      
      var bets = DB.bets(currentGame);
      if(bets.length >= 2){
        if(!gameTimeout){
          gameTimeout = Meteor.setTimeout(processGame, BTO.TIMER_GAME_DURATION);
          DB.activity("We have enough players, " + BTO.TIMER_GAME_DURATION/1000 + " seconds countdown starts!", "game");
          Collections.Games.update(currentGame, {$set:{startedAt: (new Date()).getTime()}});
        }
      }else{
        if(gameTimeout) { // sadly doesn't clear fast enough for the below not to process...
          Meteor.clearTimeout(gameTimeout); 
          DB.activity("Not enough players in game, countdown stopped", "game");
          Collections.Games.update(currentGame, {$set:{startedAt: undefined}});
          gameTimeout = null;
        }
      }
    }
  }, true);

});


