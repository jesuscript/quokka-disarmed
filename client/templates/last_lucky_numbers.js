Template.lastLuckyNumbers.helpers({
  luckyNumbers: function(){
    var games = Collections.Games.find({completed: true},{sort: {completedAt: -1}}).fetch();

    return _.map(games, function(game){ return game.luckyNum; });
  }
});
