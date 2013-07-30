Template.resultsSwitcher.helpers({
  displayResults: function() {
    return Session.get("displayResults");
  }
});

Deps.autorun(function(){
  justFinished = Collections.Games.find({
    completed: true,
    completedAt: {$gt: (new Date()).getTime() - BTO.TIMER_BACKTOGAME}
  }).count();

  if(justFinished) {
    Session.set("displayResults", true);
    setTimeout(function(){ Session.set("displayResults", false); }, BTO.TIMER_BACKTOGAME + 1); 
  }
});