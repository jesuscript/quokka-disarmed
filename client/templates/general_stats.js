/*global Template */

Template.generalStats.helpers({
  allTimeStats: function(){
    var stats = Collections.AllTimeStats.findOne({});

    if(!stats) return {};
    
    return {
      largestWin: intToBtc(stats.payoutMax),
      coinsDistributed: intToBtc(stats.payoutSum)
    };
  },
  playersLive: function(){
    return "TODO";
  }
});
