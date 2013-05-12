Template.game_on.helpers({
  active: function(){
    if(Meteor.user()) return !!Collections.Bets.findOne({playerId: Meteor.user()._id});
  }
});
