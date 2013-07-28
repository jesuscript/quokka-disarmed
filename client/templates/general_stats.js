Template.generalStats.helpers({
  allTimeStats: function(){
    var stats = Collections.AllTimeStats.findOne();
    if(!stats) return {};

    var hotNumbers = Collections.AllTimeNumbersStats.find({}, {sort: {frequency: -1}, limit: 3}).fetch();
    if(!hotNumbers) return {};
    var coldNumbers = Collections.AllTimeNumbersStats.find({}, {sort: {frequency: 1}, limit: 3}).fetch();
    if(!coldNumbers) return {};
   
    return {
      hotNumbers: hotNumbers,
      coldNumbers: coldNumbers,
      largestWin: intToBtc(stats.payoutMax).toFixed(8),
      coinsDistributed: intToBtc(stats.payoutSum).toFixed(8)
    };
  },


  connections: function(){
    var connections = Collections.Connections.findOne();

    if(!connections) return {};

    return {
      usersLoggedIn: connections.usersLoggedIn,
      usersObserving: connections.usersObserving
    }
  }
});

