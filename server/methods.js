Meteor.methods({
  submitBet: function(){
    var bogus;
    for(var i=0; i< 2000000000; i++) bogus = i;
      
    return {
      lucky_number: Math.floor(Math.random() * 101)
    }
  }
});
