DB.currentGame = function(){
  return Collections.Games.findOne({completed: false});
}
