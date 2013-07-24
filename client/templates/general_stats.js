Template.generalStats.helpers({
  allTimeStats: function(){
    var stats = Collections.AllTimeStats.findOne();

    if(!stats) return {};
    
    return {
      largestWin: intToBtc(stats.payoutMax),
      coinsDistributed: intToBtc(stats.payoutSum)
    };
  },
  // METEOR-TODO have to do this because fields specifiers currently not allowed on client
  connections: function(){
    var connections = Collections.Connections.findOne();

    if(!connections) return {};

    return {
      usersLoggedIn: connections.usersLoggedIn,
      usersObserving: connections.usersObserving
    }
  }
});
