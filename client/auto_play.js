var createRange = function(rangeTightness){
  var a = _.random(1,100);
  var bEnd = (a + _.random(1, rangeTightness));
  var b = (bEnd >= 100) ? 100: bEnd;

  return {
    min: a,
    max: b
  };
};


AutoPlay = {
  _profile: '',
  _balanceMultiplier: '',
  _timerRange: '',
  _rangeTightness: '',


  help: function() {
    console.log('arguments: AutoPlay.([shy|normal|bezerk])');
  },


  _setBehaviour: function(profile) {
    if (!profile || !profile.match("shy|normal|bezerk")) {
      console.log('Invalid profile specified, going shy');
      _profile = 'shy';
    } else {
      _profile = profile;
      console.log('Profile set to ' + _profile);
    }
    switch (_profile) {
    case 'shy':
      this._profile = 'shy';
      this._balanceMultiplier = 0.02;
      this._balanceMultiplierExtent = 5;
      this._timerRange = 12000;
      this._rangeTightness = 100;
      break;
    case 'normal':
      this._profile = 'normal';
      this._balanceMultiplier = 0.04;
      this._balanceMultiplierExtent = 20;
      this._timerRange = 6000;
      this._rangeTightness = 50;
      break;
    case 'bezerk':
      this._profile = 'bezerk';
      this._balanceMultiplier = 0.06;
      this._balanceMultiplierExtent = 100;
      this._timerRange = 2000;
      this._rangeTightness = 10;
      break;
    }
  },


  start: function(profile){
    var user = Meteor.user();
    if(!user){
      throw new Error("You need to sign in in order to auto-play");
    }

    var self = this;

    this._setBehaviour(profile);
    
    this.observer && this.stop();

    console.log('Started auto-play on profile ' + this._profile +
      '\n balance multiplier set to ' + this._balanceMultiplier + 
      '\n balance multiplier extent set to ' + this._balanceMultiplierExtent + '%' + 
      '\n timer range set to ' + this._timerRange + 
      '\n range tightness set to ' + this._rangeTightness);

    this.observer = Collections.Games.find({completed: false}).observeChanges({
      _suppress_initial: true,
      added: function(){
        setTimeout(function(){
          if(user.balance === 0) {
            console.log("Balance is zero, stopping auto-play.");
            self.stop();
          }

          var baseAmount = user.balance * self._balanceMultiplier;
          var amount = baseAmount + (baseAmount * (_.random(1, self._balanceMultiplierExtent)/100));
          var range = createRange(self._rangeTightness);

          console.log("Auto-play: betting ฿" + intToBtc(amount) +
                      " on ["+range.min + "," + range.max + "]");

          Meteor.call("submitBet", amount, range.min, range.max);
        }, _.random(BTO.TIMER_BACKTOGAME, BTO.TIMER_BACKTOGAME + self._timerRange));
      }
    });

    return 'OK';
  },


  stop: function(){
    this.observer.stop();
    this.observer = null;

    console.log("Auto-play stopped");
  }
};
