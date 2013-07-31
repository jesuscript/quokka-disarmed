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

      if (existingBet) {
        // only update bets if something has changed
        if ((existingBet.amount !== amount) || (existingBet.rangeMin !== rangeMin) || (existingBet.rangeMax !== rangeMax)) {
          Collections.Bets.update({_id: existingBet._id}, {
            $set: {
              amount: amount,
              rangeMin: rangeMin,
              rangeMax: rangeMax
            }
          });

          var updateTextRange = (rangeMin === rangeMax) ? "single number " + rangeMin + "!" : rangeMin + "-" + rangeMax;
          DB.activity(Meteor.user().username + " updates bet to ฿" + intToBtc(amount) + " on " + updateTextRange, 'user');
        } else { console.warn('SECWARN: Identical updated bet blocked'); }

      }else{
        Collections.Bets.insert({
          playerName: Meteor.user().username,
          playerId: this.userId,
          gameId: gameId,
          amount: amount, 
          rangeMin: rangeMin,
          rangeMax: rangeMax
        });

        var betTextRange = (rangeMin === rangeMax) ? "single number " + rangeMin + "!" : rangeMin + "-" + rangeMax;
        DB.activity(Meteor.user().username + " bets ฿" + intToBtc(amount) + " on " + betTextRange, 'user');
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

      if (bet) {      
        Collections.Bets.remove({_id: bet._id});
        var revokeTextRange = (bet.rangeMin === bet.rangeMax) ? "single number " + bet.rangeMin + "!" : bet.rangeMin + "-" + bet.rangeMax;
        DB.activity(Meteor.user().username + " revokes bet (was ฿" + intToBtc(bet.amount) + " on " + revokeTextRange + ")", 'user');
      } else { console.warn('SECWARN: Trying to revoke a bet that didn\'t exist'); }

    } else { console.warn('SECWARN: Trying to revoke a bet while there is no game in place'); }
    
  }
});



function validBet(amount, rangeMin, rangeMax){
  var isValidBet = true;
  var reason = '';

  if (!Meteor.userId()) {
    reason = 'Invalid User'; 
    isValidBet = false;
  }

  if ((rangeMin <= 0) || (rangeMin > rangeMax) || (rangeMax > 100)) {
    reason = 'Invalid Range'; 
    isValidBet = false;
  }

  if (Meteor.user().balance < amount) {
    reason = 'Amount > User Balance';
    isValidBet = false;
  }

  if (amount <= 0) {
    reason = 'Amount <= 0';
    isValidBet = false;
  }

  if ((typeof rangeMin !== "number") || (typeof rangeMax !== "number")) {
    reason = 'RangeMin or rangeMax of invalid type';
    isValidBet = false;
  }

  if (!isValidBet) console.warn('SECWARN: Attempt to pass invalid bet detected. Reason: ' + reason);

  return isValidBet;

}
