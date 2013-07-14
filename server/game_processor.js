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
    var allTimeStats = Collections.AllTimeStats.findOne();
    var payoutSum  = 0;
    var payoutMax = 0;

    if(!allTimeStats){
      Collections.AllTimeStats.insert(allTimeStats = {
        payoutMax: 0,
        payoutSum: 0
      });
    }

    _.each(bets, function(bet){
      decrements[bet.playerId] = - bet.amount;
    });

    _.each(payouts, function(payout, id){
      Collections.Payouts.insert({
        gameId: currentGame._id,
        playerId: id,
        payout: payout,
        timestamp: (new Date()).getTime()
      });
    });

    payoutSum = _.reduce(payouts, function(memo, p){ return memo + p; }, 0, this);
    payoutMax = _.max(payouts, function(p){ return p; });

    Collections.AllTimeStats.update(allTimeStats, {
      $set: {
        payoutMax: (payoutMax > allTimeStats.payoutMax) ? payoutMax : allTimeStats.payoutMax
      },
      $inc: {
        payoutSum: payoutSum
      }
    });
    

    payouts = game.mergePayouts(payouts, decrements);
    
    _.each(payouts, function(payout, id){
      Meteor.users.update({_id: id},{$inc: {balance: payout}});
    });
    
    Collections.Games.update(currentGame, {$set:{
      completedAt: (new Date()).getTime(),
      completed: true,
      luckyNum: luckyNum
    }});
  };
  
  Observe.currentGame({
    gameUpdate: function(){
      var currentGames = Collections.Games.find({completed: false}).fetch();
      
      if(currentGames.length > 1){
        console.warn("Two uncompleted games found:", currentGames);
      } 
      if(currentGames.length < 1){
        console.warn("0 games, creating a new one");
        Collections.Games.insert({
          completed: false,
          createdAt: (new Date()).getTime()
        });
      } 
    },
    betUpdate: function(){ return;
      var currentGame = DB.currentGame();

      if(!currentGame) return;
      
      var bets = DB.bets(currentGame);

      if(bets.length >= 2){
        if(!gameTimeout){
          gameTimeout = Meteor.setTimeout(processGame, 3000);
          Collections.Games.update(currentGame, {$set:{startedAt: (new Date()).getTime()}});
        }
      }else{
        Meteor.clearTimeout(gameTimeout);
        gameTimeout = null;
        
        Collections.Games.update(currentGame, {$set:{startedAt: undefined}});
      }
    }
  }, true);
});


