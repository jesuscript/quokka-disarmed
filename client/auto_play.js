/*global _, AutoPlay, Meteor, Collections, intToBtc, BTO */

var profiles = {
  normal: {
    profile: 'normal',
    balanceMultiplier: 0.04,
    balanceMultiplierExtent: 20,
    timerRange: 6000,
    rangeTightness: 50
  },
  berserk: {
    profile: 'bezerk',
    balanceMultiplier: 0.06,
    balanceMultiplierExtent: 100,
    timerRange: 2000,
    rangeTightness: 10
  },
  house:{
    profile: "house",
    balanceMultiplier: 0.2,
    balanceMultiplierExtent: 0,
    timerRange:0,
    rangeTightness: null
  }
};


var createRange = function(rangeTightness){
  if(!rangeTightness) return {min: 1, max: 100};
  
  var a = _.random(1,100 - rangeTightness + 1);
  var b = (a + _.random(0, rangeTightness));

  return {
    min: a,
    max: b
  };
};


AutoPlay = {
  help: function() {
    console.log('arguments: AutoPlay.([shy|normal|berserk])');
  },
  start: function(profile){
    if(!Meteor.user()){
      throw new Error("You need to sign in in order to auto-play");
    }

    if(this.observer){
      console.log("Another instance of auto-play already running. Aborting");

      return;
    }
    
    this._setBehaviour(profile);
    
    this._printConfig();

    this._startObserving();
  },


  stop: function(){
    this.observer.stop();
    this.observer = null;

    console.log("Auto-play stopped");
  },

  _setBehaviour: function(profile) {
    if(!_.has(profiles,profile)){
      console.log("Unknown profile: " + profile);
      profile = "shy";
    }
    
    console.log("Profile set to " + profile);

    _.extend(this, profiles[profile]);
  },
  _printConfig: function(){
    console.log('Started auto-play on profile ' + this.profile +
                '\n balance multiplier set to ' + this.balanceMultiplier + 
                '\n balance multiplier extent set to ' + this.balanceMultiplierExtent + '%' + 
                '\n timer range set to ' + this.timerRange + 
                '\n range tightness set to ' + this.rangeTightness);
  },
  _startObserving: function(){
    console.log(this);
    this.observer = Collections.Games.find({completed: false}).observeChanges({
      added: function(){
        var user = Meteor.user();
        
        if(user.balance === 0) {
          console.log("Balance is zero, stopping auto-play.");
          this.stop();
        }

        var baseAmount = user.balance * this.balanceMultiplier;
        var amount = baseAmount * (1 + _.random(0, this.balanceMultiplierExtent)/100);
        var range = createRange(this.rangeTightness);

        window.setTimeout(function(){
          console.log("Auto-play: betting ฿" + intToBtc(amount) +
                      " on ["+range.min + "," + range.max + "]");

          Meteor.call("submitBet", amount, range.min, range.max);
        }.bind(this), _.random(BTO.TIMER_BACKTOGAME, BTO.TIMER_BACKTOGAME + this.timerRange));
      }.bind(this)
    });
  }
};
