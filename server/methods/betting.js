Meteor.methods({
  submitBet: function(amount, rangeMin, rangeMax){
    if(validBet(this.userId, amount, rangeMin, rangeMax)){
      var currentGame = Collections.Games.findOne({completed: false});
      var gameId = currentGame && currentGame._id;
      var user = Meteor.users.findOne({_id: this.userId});
      var existingBet;

      
      if (gameId === undefined){
        console.log("betting.submitBet: no game found, bet cancelled");
        return;
      }

      amount = Math.round(amount * 100000000);

      existingBet = Collections.Bets.findOne({playerId: this.userId, gameId: gameId});

      if(existingBet){
        if(user.balance + existingBet.amount < amount) return;

        Collections.Bets.update({_id: existingBet._id}, {
          $set: {
            amount: amount,
            rangeMin: rangeMin,
            rangeMax: rangeMax
          }
        });

        Meteor.users.update({_id: user._id},{
          $set: {
            balance: user.balance + existingBet.amount - amount
          }
        });
      }else{
        if(user.balance < amount) return;
        
        Collections.Bets.insert({
          playerId: this.userId,
          gameId: gameId,
          amount: amount, 
          rangeMin: rangeMin,
          rangeMax: rangeMax
        });

        Meteor.users.update({_id: user._id},{
          $set: {
            balance: user.balance - amount
          }
        });
      }
    }
  },
  revokeBet: function(){
    var currentGame = Collections.Games.findOne({completed: false});
    var bet;
    var user;
    
    if(currentGame){
      bet = Collections.Bets.findOne({
        gameId: currentGame._id,
        playerId: this.userId
      });
      user = Meteor.users.findOne({_id: this.userId});

      Collections.Bets.remove({_id: bet._id});

      Meteor.users.update({_id: this.userId},{
        $set: {
          balance: user.balance + bet.amount
        }
      });
    }
    
  }
});

function validBet(userId, amount, rangeMin, rangeMax){
  if (!userId) return false;
  
  //TODO: check player's balance'
  return  amount > 0 && typeof rangeMin == "number" && typeof rangeMax == "number";
}
