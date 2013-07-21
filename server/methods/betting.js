Meteor.methods({
  submitBet: function(amount, rangeMin, rangeMax){
    if(validBet(amount, rangeMin, rangeMax)){
      var currentGame = Collections.Games.findOne({completed: false});
      var gameId = currentGame && currentGame._id;
      var existingBet;
      
      if (gameId === undefined){
        throw Meteor.Error(500, "No active games found");
      }

      existingBet = Collections.Bets.findOne({playerId: Meteor.userId(), gameId: gameId});

      if(existingBet){
        //console.log('udpating bet request');
        Collections.Bets.update({_id: existingBet._id}, {
          $set: {
            amount: amount,
            rangeMin: rangeMin,
            rangeMax: rangeMax
          }
        });
      }else{
        //console.log('inserting bet request');
        Collections.Bets.insert({
          playerName: Meteor.user().username,
          playerId: Meteor.userId(),
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
        playerId: Meteor.userId()
      });

      Collections.Bets.remove({_id: bet._id});
    }
    
  }
});

function validBet(amount, rangeMin, rangeMax){
  var validBet = true;
  var reason = '';

  if (!Meteor.userId()) {
    reason = 'Invalid User'; 
    validBet = false;
  }

  if ((rangeMin <= 0) || (rangeMin > rangeMax) || (rangeMax > 100)) {
    reason = 'Invalid Range'; 
    validBet = false;
  }

  if (Meteor.user().balance < amount) {
    reason = 'Amount > User Balance';
    validBet = false;
  }

  if (amount <= 0) {
    reason = 'Amount <= 0';
    validBet = false;
  }

  if ((!typeof rangeMin == "number") || (!typeof rangeMax == "number")) {
    reason = 'RangeMin or rangeMax of invalid type';
    validBet = false;
  }

  if (!validBet) console.warn('SECWARN: Attempt to pass invalid bet detected. Reason: ' + reason);

  return validBet;

}
