db = {};

db.current_player = function(){
  return collections.Players.findOne(Session.get("current_player_id"));
}
