Template.playerHeader.events({
  "click .signup-btn": function(e){
    e.preventDefault();
    Auth.showSignupDialog();
  },
  "click .signin-btn": function(e){
    e.preventDefault();
    Auth.showSigninDialog();
  }
});

var previousBalance = null;

Template.playerHeader.helpers({
  playerInfo: function(){
    var user = Meteor.user();
    var balanceClass = "";
    
    if(!user) return {};

    if(previousBalance !== null){
      if(previousBalance > user.balance) balanceClass = "decreased";
      if(previousBalance < user.balance) balanceClass = "increased";
    }

    previousBalance = user.balance;

    return {
      username: user.username,
      balance: intToBtc(user.balance),
      balanceClass: balanceClass
    };
  }
});


