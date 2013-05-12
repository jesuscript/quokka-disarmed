Meteor.methods({
  submitBet: function(amount, rangeMin, rangeMax){
    if(validBet(this.userId, amount, rangeMin, rangeMax)){
      var currentGame = Collections.Games.findOne({completed: false});
      var gameId = currentGame && currentGame._id;
      var existingBet;
      
      if (gameId === undefined){
        gameId = Collections.Games.insert({
          completed: false
        });
      }

      amount = Math.round(amount * 100000000);

      existingBet = Collections.Bets.findOne({playerId: this.userId, gameId: gameId});

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
  }
});

function validBet(userId, amount, rangeMin, rangeMax){
  if (!userId) return false;
  
  //TODO: check player's balance'
  return  amount > 0 && typeof rangeMin == "number" && typeof rangeMax == "number";
}
