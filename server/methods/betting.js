Meteor.methods({
  submitBet: function(argAmount, argRangeMin, argRangeMax){
    check(argAmount, Match.Integer);
    check(argRangeMin, Match.Integer);
    check(argRangeMax, Match.Integer);
    
    if(validBet(argAmount, argRangeMin, argRangeMax)){
      var amount = parseInt(argAmount, 10); 
      var rangeMin = parseInt(argRangeMin, 10);
      var rangeMax = parseInt(argRangeMax, 10);

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
    reason = reason + '\n' + '* invalid user'; 
    isValidBet = false;
  }

  if ((rangeMin <= 0) || (rangeMin > rangeMax) || (rangeMax > 100)) {
    reason = reason + '\n' + '* invalid range: ' + rangeMin + '-' + rangeMax; 
    isValidBet = false;
  }

  if (Meteor.user().balance < amount) {
    reason = reason + '\n' + '* amount > user balance: ' + Meteor.user().balance + ' < ' + amount;
    isValidBet = false;
  }

  if (!isValidInt(amount)) {
    reason = reason + '\n' + '* amount is of invalid type: ' + amount;
    isValidBet = false;
  }

  if (amount <= 0) {
    reason = reason + '\n' + '* amount <= 0: ' + amount;
    isValidBet = false;
  }

  if (!isValidInt(rangeMin) || !isValidInt(rangeMax)) {
    reason = reason + '\n' + '* rangeMin or rangeMax of invalid type: ' + rangeMin + '-' + rangeMax;
    isValidBet = false;
  }

  var userName = (Meteor.user().username) ? Meteor.user().username : 'Unknown user';
  if (!isValidBet) console.warn('SECWARN: ' + userName + ' attempted to pass an invalid bet. Reason(s):' + reason);

  return isValidBet;

}
