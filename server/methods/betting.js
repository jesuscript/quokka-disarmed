Meteor.methods({
  submitBet: function(amount, rangeMin, rangeMax){
    if(validBet(this.userId, amount, rangeMin, rangeMax)){
      var currentGame = Collections.Games.findOne({completed: false});
      var gameId = currentGame && currentGame._id;
      var existingBet;
      
      if (gameId === undefined){
        throw Meteor.Error(500, "No active games found");
      }

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
          playerName: Meteor.user().username,
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
  var validBet = true;
  var reason = '';

  if (!userId) {
    reason = 'Invalid User'; 
    validBet = false;
  }

  if ((rangeMin < 0) || (rangeMin > rangeMax) || (rangeMax > 100)) {
    reason = 'Invalid Range'; 
    validBet = false;
  }

  if (Meteor.user().balance < amount) {
    reason = 'Amount > User Balance';
    validBet = false;
  }

  if ((amount < 0) || (!typeof rangeMin == "number") || (!typeof rangeMax == "number")) {
    reason = 'Amount < 0 or rangeMin Max of invalid type';
    validBet = false;
  }

  if (!validBet) console.warn('SECWARN: Attempt to pass invalid bet detected. Reason: ' + reason);

  return validBet;

}
