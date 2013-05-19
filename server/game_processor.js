Meteor.startup(function(){
  
  Observe.currentGame({
    gameUpdate: function(){
      var currentGames = Collections.Games.find({completed: false}).fetch();
      
      if(currentGames.length > 1){
        console.log("Two uncompleted games found:", currentGames);
      } 
      if(currentGames.length < 1){
        console.log("0 games, creating a new one");
        Collections.Games.insert({ completed: false });
      } 
    },
    betUpdate: function(){
      var currentGame = Collections.Games.findOne({completed: false});

      if(!currentGame) return;
      
      var bets = Collections.Bets.find({gameId: currentGame._id}).fetch();

      
      if(bets.length >= 2){
        var bank = _.reduce(bets, function(memo, bet){ return memo + bet.amount; }, 0);
        var luckyNumber = Math.floor(Math.random() * 100);
        
        var totalClaim = _.reduce(bets, function(memo, bet){
          return memo + Game.claim(bet.amount, bet.rangeMin, bet.rangeMax, luckyNumber);
        }, 0);

        var rewardable = Game.rewardable(bank, totalClaim);

        var totalLostStakes = _.reduce(bets, function(memo, bet){
          if(bet.rangeMin <= luckyNumber && bet.rangeMax >= luckyNumber) return memo;

          return memo + bet.amount;
        },0);

        var leftover = Game.leftover(bank, rewardable);

        _.each(bets, function(bet){
          var player = Meteor.users.findOne({_id: bet.playerId}); // N+1 , optimise this
          var claim = Game.claim(bet.amount, bet.rangeMin, bet.rangeMax, luckyNumber);
          var credit = 0;

          if(claim){
            credit = Game.reward(claim, rewardable, bank);
          }else{
            credit = Game.compensation(bet.amount, totalLostStakes, leftover);
          }

          var playerStats = {
            playerId: bet.playerId,
            gameId: bet.gameId,
            claim: claim,
            reward: claim ? credit : 0,
            compensation: claim ? 0 : credit,
            stake: bet.amount,
            rangeMin: bet.rangeMin,
            rangeMax: bet.rangeMax
          };

          console.log("playerStats: ", playerStats);
          
          Meteor.users.update({_id: bet.playerId},{ // N+1 , optimise this
            $set: {
              balance: player.balance + credit // increase the balance
            }
          })
        });

        var gameStats = {
          bank: bank,
          luckyNumber: luckyNumber,
          totalClaim: totalClaim,
          rewardable: rewardable,
          totalLostStakes: totalLostStakes,
          leftover: leftover
        };

        console.log(gameStats);

        Collections.Games.update({_id: currentGame._id},{$set:{
          completed: true
        }});
      }
    }
  }, true);
});


