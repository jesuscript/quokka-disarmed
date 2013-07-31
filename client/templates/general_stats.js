Template.generalStats.helpers({
  allTimeStats: function(){
    var stats = Collections.AllTimeStats.findOne();
    if(!stats) return {};

    var hotColdStats = Collections.HotColdStats.findOne();
    if(!hotColdStats) return {};

    return {
      hotNumbers: hotColdStats.topThree,
      coldNumbers: hotColdStats.bottomThree,
      largestWin: intToBtc(stats.winMax).toFixed(8),
      coinsDistributed: intToBtc(stats.winSum).toFixed(8)
    };
  },


  connections: function(){
    var connections = Collections.Connections.findOne();

    if(!connections) return {};

    return {
      usersLoggedIn: connections.usersLoggedIn,
      usersObserving: connections.usersObserving
    };
  }
});

