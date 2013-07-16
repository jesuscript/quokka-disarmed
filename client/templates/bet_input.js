var $betSlider;
var $betStacked;

var windowLoaded = false;
var templateRendered = false;

var initBetSlider = function(){
  if($betSlider.data("uiRangeSlider")){
    $betSlider.rangeSlider("resize");
  }else{
    $betSlider.rangeSlider({
      bounds:{min:1, max: 100},
      step: 1
    })
  }
};

var initBetStacked = function(){
  if(!$betStacked.data("btoStackedBetGraph")){
    $betStacked.stackedBetGraph();
    Deps.autorun(function(){
      $betStacked.stackedBetGraph("redraw", Collections.Bets.find().fetch());
    });
  };
};

var initPlugins = function(){
  initBetSlider(); 
  initBetStacked();
};

Template.betInput.rendered = function(){
  $betSlider = $(this.find(".bet-slider"));
  $betStacked = $(this.find(".bet-graph"));
  $(this.find('.stake')).autoNumeric('init', {mDec: '8', aPad: false, aSep: ''} );
  $(this.find('.stake')).click(function() { $(this).select(); });  
  templateRendered = true;
  if(windowLoaded) initPlugins(); // otherwise init in window load callback
};

$(window).load(function(){
  windowLoaded = true;
  if(templateRendered) initPlugins(); //i'm sure there must be a better way to do this...
});

Template.betInput.helpers({
  activeBet: function(){
    return Meteor.user() && Collections.Bets.findOne({playerId: Meteor.user()._id});
  },
  betAmount: function(){
    var bet = Meteor.user() && Collections.Bets.findOne({playerId: Meteor.user()._id});
    if(bet){
      bet = intToBtc(bet.amount);
    }else{
      bet = Session.get("betInput_stake");
    }
    return bet || 0;
  },
  sufficientFunds: function(){
    var bal = Meteor.user().balance;
    var stake = Session.get("betInput_stake") || 0;
    return Meteor.user() &&  bal > 0 && bal >= btcToInt(stake);
  }
});



Template.betInput.events({
  "click .bet-btn, click .update-btn, submit form":function(){
    event.preventDefault();
    var amount = $("input.stake").val() || 0;
    var range = $betSlider.rangeSlider("values");
    if (amount <= 0) {
       $(".stake").parents('.control-group').addClass('error'); // thanks to meteor spark, field control group resets to the correct class after an element update!
       $(".stake").focus().select();  
    } 
    if (range.min <= range.max) {  // likely unnecessary but just in case...      
      Meteor.call("submitBet", btcToInt(amount), range.min, range.max);
    }
  },
  "click .revoke-btn": function(){
    Meteor.call("revokeBet");
  },
  "click .signin-btn": function(e){
    Auth.showSigninDialog();
  },
  "click .deposit-btn": function(e){
    e.preventDefault();
    Template.bank.toggleOpen();
  },
  "keyup .stake": function(){
    Session.set("betInput_stake", $("input.stake").val());
  },
  "click .stake-buttons .btn": function(e){
    var $btn = $(e.currentTarget);
    var oldStake = parseFloat($("input.stake").val(),10);
    var newStake = 0;
    var user = Meteor.user();
    
    if($btn.is(".btn-01")) newStake = 0.1 + oldStake;
    if($btn.is(".btn-001")) newStake = 0.01 + oldStake;
    if($btn.is(".btn-0001")) newStake = 0.001 + oldStake;
    if($btn.is(".btn-max") && user) newStake = intToBtc(user.balance);
    if($btn.is(".btn-x2")) newStake = oldStake * 2;

    newStake = Math.round(newStake * 100000000) / 100000000;

    $("input.stake").val(newStake);
    Session.set("betInput_stake", newStake);

    e.preventDefault();
  }
});

Template.betInput.preserve([".stake"]);
