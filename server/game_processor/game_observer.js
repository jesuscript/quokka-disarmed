Observe.currentGame = function(callbacks, runCallbacks){
  //console.log('inside observe function');
  var self = this;
  var gameCursor = Collections.Games.find({completed: false});
  var betsHandle, gameHandle;
  
  if(runCallbacks) _.each(callbacks, function(func){ func(); });


  var observeBets = function(){
    callbacks.gameUpdate && callbacks.gameUpdate();

    var currentGame = gameCursor.fetch()[0];
    gameCursor.rewind(); //FFFFFFFFFFFFFUUUUUUUUUUUUUUUUUUUUUUUUUUUU
    
    if(betsHandle) {
      betsHandle.stop();
    }
    
    if(! currentGame) return;

    betsHandle = Collections.Bets.find({gameId: currentGame._id}).observeChanges({ 
      _suppress_initial: true,
      added: callbacks.betUpdate,
      removed: callbacks.betUpdate
    });
  };

  gameHandle = gameCursor.observeChanges({
    _suppress_initial: true,
    added: observeBets,
    removed: observeBets
  });

  observeBets();

  return {
    stop: function(){
      betsHandle.stop();
      gameHandle.stop();
    } 
  };
}
