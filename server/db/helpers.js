_.extend(DB,{
  currentGame: function(){
    return Collections.Games.findOne({completed: false});
  },
  bets: function(game){
    return Collections.Bets.find({gameId: game._id}).fetch();
  },
  activity: function(msg,type){
    Collections.Activity.insert({
      type: type,
      message: msg,
      timestamp: (new Date()).getTime()
    });
  }
});
