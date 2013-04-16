Meteor.methods({
    submitBet: function(amount, rangeMin, rangeMax){
        if(validBet(this.userId, amount, rangeMin, rangeMax)){
            
            var gameId = db_helpers.current_game() && db_helpers.current_game()._id;
            
            if (gameId === undefined){
                gameId = collections.Games.insert({
                    completed: false
                });
            }

            amount = Math.round(amount * 100000000);

            collections.Bets.insert({
                playerId: this.userId,
                gameId: gameId,
                amount: amount, 
                rangeMin: rangeMin,
                rangeMax: rangeMax
            });
        }
    }
});

function validBet(userId, amount, rangeMin, rangeMax){
    if (!userId) return false;
    
    //TODO: check player's balance'
    return  amount > 0 && typeof rangeMin == "number" && typeof rangeMax == "number";
}
