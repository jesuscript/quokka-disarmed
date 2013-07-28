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
    _calculateHotColdNumbers(luckyNum);

    payouts = game.mergePayouts(payouts, decrements);
    
    _.each(payouts, function(payout, id){
      Meteor.users.update({_id: id},{$inc: {balance: payout}});
    });
    
    Collections.Games.update(currentGame, {$set:{
      completedAt: (new Date()).getTime(),
      completed: true,
      luckyNum: luckyNum
    }});

    Collections.Games.insert({
      completed: false,
      createdAt: (new Date()).getTime()
    });
  };
  
  console.log('invoking observe.currentgame');
  Observe.currentGame({
    betUpdate: function(){ 
      var currentGame = DB.currentGame();

      if(!currentGame) return;
      
      var bets = DB.bets(currentGame);

      if(bets.length >= 2){
        if(!gameTimeout){
          gameTimeout = Meteor.setTimeout(processGame, 10000);
          //gameTimeout = Meteor.setTimeout(processGame, 3000);
          Collections.Games.update(currentGame, {$set:{startedAt: (new Date()).getTime()}});

          DB.activity("Timer started!", "game");
        }
      }else{
        if(gameTimeout) DB.activity("Timer stopped", "game");
        
        Meteor.clearTimeout(gameTimeout);
        gameTimeout = null;
        
        Collections.Games.update(currentGame, {$set:{startedAt: undefined}});
      }
    }
  }, true);

});


