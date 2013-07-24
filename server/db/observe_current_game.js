Observe.currentGame = function(callbacks, runCallbacks){
  //console.log('inside observe function');
  var self = this;
  var gameCursor = Collections.Games.find({completed: false});
  var betsHandle, gameHandle;
  
  if(runCallbacks) _.each(callbacks, function(func){ func(); });


  var observeBets = function(){
    console.log('>>>> calling observe bets');
    callbacks.gameUpdate && callbacks.gameUpdate();

    var currentGame = gameCursor.fetch()[0];
    gameCursor.rewind(); //FFFFFFFFFFFFFUUUUUUUUUUUUUUUUUUUUUUUUUUUU
    
    if(betsHandle) {
      console.log('stoping the handle');
      betsHandle.stop();
    }

    if(! currentGame) return;

    betsHandle = Collections.Bets.find({gameId: currentGame._id}).observeChanges({ 
      _suppress_initial: true,
      added: function() { callbacks.betUpdate();  console.log("bet added"); },
      removed: function() { callbacks.betUpdate();  console.log("bet revoked"); },
      changed: function() { callbacks.betUpdate();  console.log("bet updated"); }
    });
  }

  gameHandle = gameCursor.observeChanges({
    _suppress_initial: true,
    added: function() { observeBets();  console.log("game added"); },
    removed: function() { observeBets();  console.log("game revoked"); },
    changed: function() { observeBets();  console.log("game updated"); }
  });

  observeBets();

  return {
    stop: function(){
      betsHandle.stop();
      gameHandle.stop();
    } 
  }
}
