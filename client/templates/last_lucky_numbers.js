Template.lastLuckyNumbers.helpers({
  luckyNumbers: function(){
    var games = Collections.Games.find({completed: true},{sort: {completedAt: -1}}).fetch();
    var nums = _.map(games, function(game){ return game.luckyNum; });

    return nums;
  }
});
