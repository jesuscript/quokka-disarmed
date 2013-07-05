Meteor.methods({
  submitBet: function(amount, rangeMin, rangeMax){
    if(validBet(this.userId, amount, rangeMin, rangeMax)){
      var currentGame = Collections.Games.findOne({completed: false});
      var gameId = currentGame && currentGame._id;
      var user = Meteor.users.findOne({_id: this.userId});
      var existingBet;

      
      if (gameId === undefined){
        throw Meteor.Error(500, "No active games found");
      }

      existingBet = Collections.Bets.findOne({playerId: this.userId, gameId: gameId});

      if(user.balance < amount) return;
        
      if(existingBet){
        Collections.Bets.update({_id: existingBet._id}, {
          $set: {
            amount: amount,
            rangeMin: rangeMin,
            rangeMax: rangeMax
          }
        });
      }else{
        Collections.Bets.insert({
          playerId: this.userId,
          gameId: gameId,
          amount: amount, 
          rangeMin: rangeMin,
          rangeMax: rangeMax
        });
      }
    }
  },
  revokeBet: function(){
    var currentGame = Collections.Games.findOne({completed: false});
    var bet;
    
    if(currentGame){
      bet = Collections.Bets.findOne({
        gameId: currentGame._id,
        playerId: this.userId
      });

      Collections.Bets.remove({_id: bet._id});
    }
    
  }
});

function validBet(userId, amount, rangeMin, rangeMax){
  if (!userId) return false;
  
  //TODO: check player's balance'
  return  amount > 0 && typeof rangeMin == "number" && typeof rangeMax == "number";
}
