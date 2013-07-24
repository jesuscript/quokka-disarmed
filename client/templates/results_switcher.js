Template.resultsSwitcher.helpers({
  displayResults: function() {
    return Session.get("displayResults");
  }
});

Deps.autorun(function(){
  justFinished = Collections.Games.find({
      completed: true,
      completedAt: {$gt: (new Date()).getTime() - 10000 }
    }).count();

  if(justFinished) {
    Session.set("displayResults", true);
    setTimeout(function(){ Session.set("displayResults", false); }, 10001);
  }
});       