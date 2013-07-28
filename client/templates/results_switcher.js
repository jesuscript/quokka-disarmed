Template.resultsSwitcher.helpers({
  displayResults: function() {
    return Session.get("displayResults");
  }
});

Deps.autorun(function(){

  //console.log('calling deps autorun in result switcher');
  justFinished = Collections.Games.find({
      completed: true,
      completedAt: {$gt: (new Date()).getTime() - 10000 }
    }).count();

  if(justFinished) {
      console.log('just finished');
      Session.set("displayResults", true);
     setTimeout(function(){ Session.set("displayResults", false); }, 10001);
  }
});       