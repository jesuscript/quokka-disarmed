Template.navbar.events({
  "click .signup-btn": function(e){
    e.preventDefault();
    Auth.showSignupDialog();
  },
  "click .signin-btn": function(e){
    e.preventDefault();
    Auth.showSigninDialog();
  },
  "click .signout-btn": function(e){
    e.preventDefault();
    Auth.logout();
  },
  "click .news-btn": function(e){
    e.preventDefault();
    $("body").append(Meteor.render( Template.news_dialog ));
  },
  "click .howto-btn": function(e){
    e.preventDefault();
    $("body").append(Meteor.render( Template.howto_dialog ));
  }//,
  // "click .volume-switch": function(e){
  //   e.preventDefault();
  //   //TODO
  // }  
});


Template.navbar.rendered = function(){
  var uv=document.createElement('script');
  uv.type='text/javascript';
  uv.async=true;
  uv.src='//widget.uservoice.com/9ZCCMSCPqP7NR9ZWuQzteQ.js';
  var s=document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(uv,s);
};


var previousBalance = null;

Template.navbar.helpers({
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
      balance: intToBtc(user.balance || 0), // to avoid issue where NaN is display on initial load
      balanceClass: balanceClass
    };
  }
});




// TODO
// Template.navbar.created = function (){
//   Audio.play('startup');
// }

// TODO
// Template.navbar.helpers({
//   volumeClass: function(){
//     if (Meteor.user()) return Meteor.user().profile.soundOn
//     return Meteor.user() && Collections.Bets.findOne({playerId: Meteor.user()._id});
//   }
// });