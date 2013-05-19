Observe.currentGame = function(callbacks, runCallbacks){
  var self = this;
  var gameCursor = Collections.Games.find({completed: false});
  var currentGame = gameCursor.fetch()[0];
  var betsHandle, gameHandle;

  if(runCallbacks) _.each(callbacks, function(func){ func(); });

  if(! currentGame) return;

  var observeBets = function(){
    callbacks.gameUpdate && callbacks.gameUpdate();
    
    if(betsHandle) {
      betsHandle.stop();
    }
    
    betsHandle = Collections.Bets.find({gameId: currentGame._id}).observeChanges({ 
      added: callbacks.betUpdate,
      removed: callbacks.betUpdate,
      changed: callbacks.betUpdate
    });
  }

  gameHandle = gameCursor.observeChanges({
    added: observeBets,
    removed: observeBets,
    changed: observeBets
  });

  observeBets();

  return {
    stop: function(){
      betsHandle.stop();
      gameHandle.stop();
    } 
  }
}
