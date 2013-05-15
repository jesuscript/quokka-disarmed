GameObserver = {
  _betUpdateCallbacks: [],
  init: function(){
    var self = this;
    var currentGameCur = Collections.Games.find({completed: false});
    var currentGame = currentGameCur.fetch()[0];
    var betsHandle;

    if(! currentGame) return;

    var observeBets = function(){
      if(betsHandle) {
        console.log("restart bets observer");
        betsHandle.stop();
      }
      
      betsHandle = Collections.Bets.find({gameId: currentGame._id}).observeChanges({ 
        added: self._execBetUpdateCallbacks.bind(self),
        removed: self._execBetUpdateCallbacks.bind(self),
        changed: self._execBetUpdateCallbacks.bind(self)
      });
    }

    currentGameCur.observeChanges({
      added: observeBets,
      removed: observeBets,
      changed: observeBets
    });

    observeBets();
  },
  addBetUpdateCallback:function(callback){
    if (_.find(this._betUpdateCallbacks, function(func){
      return String(callback) === String(func);
    })) return; // don't want the same callback added twice

    this._betUpdateCallbacks.push(callback);
  },
  _execBetUpdateCallbacks:function(){
    _.each(this._betUpdateCallbacks, function(callback){ callback(); });
  } 
};

Meteor.startup(function(){
  GameObserver.init();
  
  /*
  console.log("observer");

  var currentGames = Collections.Games.find({completed: false}).fetch();
  var bets;

  if(currentGames.length > 1) console.log("Two uncompleted games found:", currentGame);
  if(currentGames.length < 1) console.log("0 games");//return Collections.Games.insert({ completed: false });

  bets = Collections.Bets.find({gameId: currentGames[0]._id}).fetch();

  console.log(currentGames[0]);
  console.log(bets);

  */
});


