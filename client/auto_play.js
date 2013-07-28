var createRange = function(){
  var a = _.random(1,100);
  var b = _.random(1,100);

  return {
    min: Math.min(a,b),
    max: Math.max(a,b)
  };
};

AutoPlay = {
  start: function(balanceMultiplier){
    var user = Meteor.user();
    var that = this;
    
    if(balanceMultiplier === undefined || balanceMultiplier <= 0 || balanceMultiplier >= 1){
      balanceMultiplier = 0.2;
    }

    if(!user){
      throw new Error("You need to sign in in order to auto-play");
    }

    this.observer && this.stop();

    console.log("Started auto-play with balance multiplier set to " + balanceMultiplier);

    this.observer = Collections.Games.find({completed: false}).observeChanges({
      added: function(){
        setTimeout(function(){
          if(user.balance === 0) {
            console.log("Balance is zero, stopping auto-play.");
            that.stop();
          }

          var amount = Math.round(user.balance * balanceMultiplier);
          var range = createRange();

          console.log("Auto-play: betting ฿" + intToBtc(amount) +
                      " on ["+range.min + "," + range.max + "]");

          Meteor.call("submitBet", amount, range.min, range.max);
        },7000);
      }
    });
  },
  stop: function(){
    this.observer.stop();
    this.observer = null;

    console.log("Auto-play stopped");
  }
};
