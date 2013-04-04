Meteor.methods({
  submitBet: function(player_id, amount, range){ //TODO replace player_id with user_id from Accounts
    var lucky_number = Math.ceil(Math.random() * 100); //TODO replace with a call to RNG API
    
    //var bogus;
    //for(var i=0; i< 2000000000; i++) bogus = i;

    
    if(player_id && amount > 0){
      var range_size = range.max - range.min + 1;
      var player = collections.Players.findOne(player_id);
      var amount_won = 0;

      if(amount > player.balance) amount = player.balance; //TODO reaplce with an error

      collections.Players.update({_id: player._id},{
        $set: {
          balance: player.balance - amount + Game.reward(amount, range.min, range.max, lucky_number)
        }
      });


      collections.Games.insert({
        username: player.username,
        range: range,
        lucky_number: lucky_number,
        amount: amount,
        reward: amount_won,
        timestamp: new Date()
      });
    }
    
    return {
      lucky_number: lucky_number
    };
  },
  signup: function(username){
    var player = collections.Players.findOne({username: username});
    
    if(player == undefined){
      player = {
        username: username,
        balance: 30
      }
      return  collections.Players.insert(player);
    }
    
    return player._id;
  }
});
