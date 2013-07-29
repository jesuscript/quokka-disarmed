_calculateAllTimeStats = function(payouts) {
  var allTimeStats = Collections.AllTimeStats.findOne();
  var payoutSum  = 0;
  var payoutMax = 0;

  if(!allTimeStats){
    Collections.AllTimeStats.insert(allTimeStats = {
      payoutMax: 0,
      payoutSum: 0
    });
  }

  payoutSum = _.reduce(payouts, function(memo, p){ return memo + p; }, 0, this);
  payoutMax = _.max(payouts, function(p){ return p; });

  Collections.AllTimeStats.update(allTimeStats, {
    $set: {
      payoutMax: (payoutMax > allTimeStats.payoutMax) ? payoutMax : allTimeStats.payoutMax
    },
    $inc: {
      payoutSum: payoutSum
    }
  });
};


_calculateAllTimeWinners = function(payouts) {
  _.each(payouts, function(amount, playerId) { // meteor doesn't support upserts yet
    if (Collections.AllTimeWinners.find({playerId: playerId}).count() !== 0) {
      Collections.AllTimeWinners.update({playerId: playerId}, {$inc: {totalReceived: amount}});
    } else {
      var player = Meteor.users.findOne({_id: playerId}, {fields: {username: 1}});
      Collections.AllTimeWinners.insert({playerId: playerId, playerName: player.username, totalReceived: amount});
    }
  });
};


// this is aggregate data, leave this in even though hot/cold numbers uses a different query to display things on screen
_calculateHotColdNumbersAggregates = function(luckyNum) {
  var allTimeNumbersStats = Collections.AllTimeNumbersStats.findOne();
  if (!allTimeNumbersStats) {
    for (var i = 1; i <= 100; i++) {
      Collections.AllTimeNumbersStats.insert({num: i, frequency: 0});
    }
  }
  Collections.AllTimeNumbersStats.update({num: luckyNum}, {$inc: {frequency: 1}});
};


_calculateHotColdNumbers = function() {
  var last200LuckyNums = Collections.Games.find({completed: true}, {sort: {createdAt: -1}, limit: 200, fields: {luckyNum: 1}}).fetch();
  var groups = _.sortBy(_.groupBy(_.pluck(last200LuckyNums, 'luckyNum')), "length");
  var topThree = _.pluck(groups.slice(-3),0).reverse();
  var bottomThree = _.pluck(groups.slice(0, 3),0);
  var hotColdStats = Collections.HotColdStats.findOne();
  console.dir(groups);
  if (!hotColdStats) {
    Collections.HotColdStats.insert(hotColdStats = {topThree: topThree, bottomThree: bottomThree});
  }
  Collections.HotColdStats.update({}, {topThree: topThree, bottomThree: bottomThree});
};

