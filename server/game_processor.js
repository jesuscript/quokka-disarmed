/*global GetRandInt, Meteor, Observe, Collections */

Meteor.startup(function(){
  var gameTimeout = null;

  var processGame = function(){
    var currentGame = DB.currentGame();
    var luckyNum = GetRandInt();
    var bets = DB.bets(currentGame);
    var game = new Quokka(bets);
    var payouts = game.computeResults(luckyNum);

    _.each(bets, function(bet){ //<< is there any way to optimise this?
      Meteor.users.update({_id: bet.playerId}, {$inc: {balance: - bet.amount}});
    });

    _.each(payouts, function(payout, id){
      console.log(payout, id);

      Meteor.users.update({_id: id},{$inc: {balance: payout}});
      
      Collections.Payouts.insert({
        gameId: currentGame._id,
        playerId: id,
        payout: payout,
        timestamp: (new Date()).getTime()
      });
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
        console.log("Two uncompleted games found:", currentGames);
      } 
      if(currentGames.length < 1){
        console.log("0 games, creating a new one");
        Collections.Games.insert({
          completed: false,
          createdAt: (new Date()).getTime()
        });
      } 
    },
    betUpdate: function(){
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


