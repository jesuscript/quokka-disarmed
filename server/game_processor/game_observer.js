Observe.currentGame = function(callbacks, runCallbacks){
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
    console.log('setting the observer on bets');
    betsHandle = Collections.Bets.find({gameId: currentGame._id}).observeChanges({ 
      _suppress_initial: true,
      added: function () { callbacks.betUpdate(); console.log('observe: bet added'); },
      removed: function () { callbacks.betUpdate(); console.log('observe: bet removed'); },
    });
  };

  gameHandle = gameCursor.observeChanges({
    _suppress_initial: true,
    added: observeBets
  });

  observeBets();

  return {
    stop: function(){
      betsHandle.stop();
      gameHandle.stop();
    } 
  };
}
