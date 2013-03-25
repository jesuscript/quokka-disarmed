(function(){
  Template.last_games.helpers({
    games: function(){
      return collections.Games.find({},{sort: {timestamp: -1}}).fetch();
    },
    date_and_time: function(timestamp){
      return timestamp.getDate() + "-" + (timestamp.getMonth() + 1) + "-" +
        timestamp.getFullYear() + " " + timestamp.getHours() + ":" + timestamp.getMinutes() + ":" +
        timestamp.getSeconds();
    }
  });
})();
