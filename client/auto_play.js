/*global _, AutoPlay, Meteor, Collections, intToBtc, BTO */

var profiles = {
  shy: {
    profile: 'shy', // profile name
    balanceMultiplier: 0.02, // what % of current bal the bot will play per bet
    balanceMultiplierExtent: 5, // what max % of the placed bet the bot will play on top of the current bet
    timerRange: 90, // will wait 0-timerange % of game duration after the back to game timer has expired to rebet
    rangeTightness: 70 // will play 1-rangeTightness number per bet
  },
  normal: {
    profile: 'normal',
    balanceMultiplier: 0.04,
    balanceMultiplierExtent: 20,
    timerRange: 60,
    rangeTightness: 50
  },
  nuts: {
    profile: 'bezerk',
    balanceMultiplier: 0.06,
    balanceMultiplierExtent: 100,
    timerRange: 20,
    rangeTightness: 10
  },
  // house should be a bot file we run separetely and privately
  // This file is just a sample bot to give people ideas
  house:{
    profile: "house",
    balanceMultiplier: 0.2,
    balanceMultiplierExtent: 0,
    timerRange: 1, // 0 leads to throws due to known Deps bug in collection publishing
    rangeTightness: null
  }
};



AutoPlay = {
  help: function() {
    Log.info('arguments: AutoPlay.([shy|normal|nuts])');
  },


  start: function(profile){
    if(!Meteor.user()){
      throw new Error("You need to sign in in order to auto-play");
    }

    if(this.observer){
      Log.info("Another instance of auto-play already running. Aborting");
      return;
    }
    
    this._setBehaviour(profile);
    this._printConfig();
    this._startObserving();

    return 'OK';
  },


  stop: function(){
    this.observer.stop();
    this.observer = null;
    if (this.autoPlayTimeout) clearTimeout(this.autoPlayTimeout);
    Log.info("Auto-play stopped");
    return 'OK';
  },


  _printConfig: function(){
    Log.info('Started auto-play on profile ' + this.profile +
                '\n balance multiplier set to ' + this.balanceMultiplier + 
                '\n balance multiplier extent set to ' + this.balanceMultiplierExtent + '%' + 
                '\n timer range % set to ' + this.timerRange + '%' + 
                '\n range tightness set to ' + this.rangeTightness);
  },


  _createRange: function(){
    if(!this.rangeTightness) return {min: 1, max: 100};
    
    var a = _.random(1, 100 - this.rangeTightness);
    var b = (a + _.random(0, this.rangeTightness));

    return {
      min: a,
      max: b
    };
  }, 


  _setBehaviour: function(profile) {
    if(!_.has(profiles,profile)){
      Log.info("Unknown profile: " + profile);
      profile = "shy";
    }
    
    Log.info("Profile set to " + profile);

    _.extend(this, profiles[profile]);
  },


  _startObserving: function(){
    this.observer = Collections.Games.find({completed: false}).observeChanges({
      // we suppress initial or else bots stat betting immediately, which would be fine if 
      // if we had written code to handle things like sniffing were the timer is at, but is brand
      // new feature in itself and will therefore wait for v2
      added: function(){
        var user = Meteor.user();
        
        if(user.balance === 0) {
          Log.info("Balance is zero, stopping auto-play.");
          this.stop();
        }

        var tmp = user.balance * this.balanceMultiplier;
        var intAmount = Math.round(tmp * (1 + _.random(0, this.balanceMultiplierExtent)/100));
        var range = this._createRange();

        this.autoPlayTimeout = window.setTimeout(function(){
          Log.info("Auto-play: betting ฿" + intToBtc(intAmount) + " on ["+range.min + "," + range.max + "]");
          Meteor.call("submitBet", intAmount, range.min, range.max);
        }.bind(this), _.random(BTO.TIMER_BACKTOGAME, BTO.TIMER_BACKTOGAME + (BTO.TIMER_GAME_DURATION * this.timerRange / 100)));
      }.bind(this)
    });
  }
};
