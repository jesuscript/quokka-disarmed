collections = {};

collections.Bets = new Meteor.Collection("bets");
collections.Games = new Meteor.Collection("games");
collections.GameStats = new Meteor.Collection("gameStats");
collections.Flags = new Meteor.Collection("flags");

if(Meteor.isServer){
  AddressPool = new Meteor.Collection("addressPool"); // server only

  Meteor.publish("flags", function(){
    return collections.Flags.find({});
  });
  Meteor.publish("gameStats", function(){
    var self = this;
    var currentGameCur = collections.Games.find({completed: false});
    var currentGame = currentGameCur.fetch()[0];
    var betsHandle;

    if(! currentGame) return;

    var recalculateStats = function(initialising){
      var bets = collections.Bets.find({gameId: currentGame._id}).fetch();
      var totalBank = _.reduce(bets, function(memo, bet){ return memo + bet.amount; }, 0);
      var numberOfPlayers = _.size(_.groupBy(bets, function(bet){ return bet.playerId; }));
      
      self.changed("gameStats", 0, { numberOfPlayers: numberOfPlayers, totalBank: totalBank});
    }

    var observeBets = function(){
      if(betsHandle) {
        console.log("restart bets observer");
        betsHandle.stop();
      }
      
      //KK: we probably don't need all 3 callbacks, but I'll leave them here for debugging
      betsHandle = collections.Bets.find({gameId: currentGame._id}).observeChanges({ 
        added: function(){ 
          console.log("bet added");
          recalculateStats();
        },
        removed: function(){
          console.log("bet removed");
          recalculateStats();
        },
        changed: function(){
          console.log("bet changed");
          recalculateStats();
        }
      });
    }

    self.added("gameStats", 0);
    
    //KK: same here
    currentGameCur.observeChanges({
      added: function(){
        console.log("game added");
        recalculateStats();
        observeBets();
      },
      removed: function(){
        console.log("game removed");
        recalculateStats();
        observeBets();
      },
      changed: function(){
        console.log("game changed");
        recalculateStats();
        observeBets();
      }
    });


    recalculateStats(true);
    
    observeBets();
    
    self.ready();
  });
  
  Meteor.publish("games", function(){
    return collections.Games.find({},{sort: {timestamp: -1}, limit: 100});
  });
  
  Meteor.publish("userData", function(){  // built-in meteor collection
    return Meteor.users.find({_id: this.userId},
                             {fields: {
                               'balance': 1,
                               'anonymous': 1,
                               'token': 1,
                               'depositAddress': 1
                             }});
  });
}

if(Meteor.isClient){
  Meteor.subscribe("games");
  Meteor.subscribe("gameStats");
  Meteor.subscribe("flags");
  Meteor.subscribe("userData");
}

// the user shouldn't have the right to modify anything within their user profiles
Meteor.users.deny({update: function () { return true; }});
