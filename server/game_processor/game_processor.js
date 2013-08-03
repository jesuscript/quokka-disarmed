/*global GetRandInt, Meteor, Observe, Collections, GameStats */

Meteor.startup(function(){
  var gameTimeout = null;

  var processGame = function(){ 
    var currentGame = DB.currentGame();
    var luckyNum = GetRandInt();
    var bets = DB.bets(currentGame);
    var game = new Quokka(bets, BTO.COMMISSION_RATE);
    var payouts = game.computeResults(luckyNum);
    var decrements = {};

    _.each(bets, function(bet){
      var player = Meteor.users.findOne({_id: bet.playerId}, {fields: {username: 1}});
      
      decrements[player._id] = - bet.amount;

      Collections.GameResults.insert({
        gameId: currentGame._id,
        playerId: player._id,
        playerName: player.username,
        payout: payouts[player._id] || 0,
        stake: bet.amount,
        won: (payouts[player._id] || 0) - bet.amount,
        timestamp: (new Date()).getTime()
      });
    });

    var finalAmounts = game.mergePayouts(payouts, decrements);
    _.each(finalAmounts, function(finalAmount, id){
      Meteor.users.update({_id: id}, {$inc: {balance: finalAmount}});
    });
    
    Collections.Games.update(currentGame, {$set:{
      completedAt: (new Date()).getTime(),
      completed: true,
      luckyNum: luckyNum
    }});

    DB.activity("The Lucky Number for game #" + currentGame.publicSeq + " is " + luckyNum, "luckyNum");
    
    GameStats.recordStats(payouts, bets, luckyNum);// needs to be here so that DB.activity() calls follow a logical progression
    
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


