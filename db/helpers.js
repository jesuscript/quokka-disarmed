if(Meteor.isServer){
  db_helpers = {};
  db_helpers.current_game = function(){
    collections.Games.findOne({completed: false});
  }
}
