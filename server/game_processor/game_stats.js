/*global GameStats, Collections, _, Meteor */

GameStats = {
  recordStats: function(payouts, bets, luckyNum){
    var wins = this.getWins(payouts, bets);
    
    this.recordAllTimeStats(wins, payouts);
    this.recordAllTimeWinners(wins);
    this.recordHotColdNumbersAggregates(luckyNum);
    this.recordHotColdNumbers();
  },

  getWins: function(payouts,bets){
    var wins = {};

    _.each(bets, function(bet){
      if(bet.amount < payouts[bet.playerId]){
        wins[bet.playerId] = payouts[bet.playerId] - bet.amount;
      }
    });
    
    var winnerCount = _.size(wins);

    if (winnerCount>0) {
      if (winnerCount > 1) {
        DB.activity("Congratulations to this game's " + winnerCount + " winners!", "game");
      } else {
        DB.activity("Congratulations to this game's winner!", "game");
      }
    }

    return wins;
  },
  
  recordAllTimeStats: function(wins, payouts) {
    var allTimeStats = Collections.AllTimeStats.findOne();
    var winSum  = 0;
    var winMax = 0;
    var coinsDist = 0; // sum of all payouts, i.e. coins redistributed over time

    if(!allTimeStats){
      Collections.AllTimeStats.insert(allTimeStats = {
        winMax: 0,
        winSum: 0,
        coinsDist: 0,
      });
    }

    if (!_.isEmpty(wins)) { // because _max returns -Infinity on an empty object
      winSum = _.reduce(wins, function(memo, w){ return memo + w; }, 0);
      winMax = _.max(wins, function(w){ return w; });
    }
    coinsDist = _.reduce(payouts, function(memo, w){ return memo + w; }, 0);

    Collections.AllTimeStats.update(allTimeStats, {
      $set: {
        winMax: (winMax > allTimeStats.winMax) ? winMax : allTimeStats.winMax
      },
      $inc: {
        winSum: winSum,
        coinsDist: coinsDist
      }
    });
  },


  recordAllTimeWinners: function(wins) {
    if (!_.isEmpty(wins)) { // because _max returns -Infinity on an empty object
      _.each(wins, function(amount, playerId) { // meteor doesn't support upserts yet
        if (Collections.AllTimeWinners.find({playerId: playerId}).count() !== 0) {
          Collections.AllTimeWinners.update({playerId: playerId}, {$inc: {totalWon: amount}});
        } else {
          var player = Meteor.users.findOne({_id: playerId}, {fields: {username: 1}});
          Collections.AllTimeWinners.insert({playerId: playerId, playerName: player.username, totalWon: amount});
        }
      });
    }
  },


  // this is aggregate data, leave this in even though hot/cold numbers uses a different query to display things on screen
  recordHotColdNumbersAggregates: function(luckyNum) {
    var allTimeNumbersStats = Collections.AllTimeNumbersStats.findOne();
    if (!allTimeNumbersStats) {
      for (var i = 1; i <= 100; i++) {
        Collections.AllTimeNumbersStats.insert({num: i, frequency: 0});
      }
    }
    Collections.AllTimeNumbersStats.update({num: luckyNum}, {$inc: {frequency: 1}});
  },


  recordHotColdNumbers: function() {
    var last200LuckyNums = Collections.Games.find({completed: true}, {sort: {createdAt: -1}, limit: 200, fields: {luckyNum: 1}}).fetch();
    var groups = _.sortBy(_.groupBy(_.pluck(last200LuckyNums, 'luckyNum')), "length");
    var topThree = _.pluck(groups.slice(-3),0).reverse();
    var bottomThree = _.pluck(groups.slice(0, 3),0);
    var hotColdStats = Collections.HotColdStats.findOne();
    if (!hotColdStats) {
      Collections.HotColdStats.insert(hotColdStats = {topThree: topThree, bottomThree: bottomThree});
    }
    Collections.HotColdStats.update({}, {topThree: topThree, bottomThree: bottomThree});
  }
};
