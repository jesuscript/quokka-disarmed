Template.withdraw_dialog.events({

  'click .submit-btn': function(e, tmpl){
    var address = $("#withdraw-dialog [name=address]").val();
    var amount = $("#withdraw-dialog [name=amount]").val();
    // client validation very limited on purpose as most of it would be doing server calls anyway
    // ... and code would end up being duplicated
    if(address.length < 27 || address.length > 34){
      Session.set("withdraw_error", {
        error: 406,
        reason: "Address is invalid"
      });
    } else {
      Meteor.call('requestWithdrawal',
        address,
        amount,
        function(err, transfered){
          if(err){
            Session.set("withdraw_error", err);
          }else{
            Session.set("withdraw_error");
            TemplateHelpers.removeDialog(tmpl);
            Session.set("lastTrx", transfered);
            if (transfered) {
              $("body").append(Meteor.render( Template.withdraw_confirmation_instant ));
            } else {
              $("body").append(Meteor.render( Template.withdraw_confirmation_delayed ));
            }
          }
        }
      );
    }
  },
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    TemplateHelpers.removeDialog(tmpl, function(){
        Session.set("withdraw_error");
    });
  }  
});




Template.withdraw_confirmation_instant.helpers({
  address: function(){
    var lastTrx = Session.get("lastTrx");
    return lastTrx.addr;
  },
  txId: function(){
    var lastTrx = Session.get("lastTrx");
    return lastTrx.txId;
  },
  amount: function(){
    var lastTrx = Session.get("lastTrx");
    return lastTrx.amt;
  }
});


Template.withdraw_confirmation_instant.events({
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    TemplateHelpers.removeDialog(tmpl);
  },
});



Template.withdraw_confirmation_delayed.events({
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    TemplateHelpers.removeDialog(tmpl);
  },
});



Template.withdraw_dialog.rendered = function(){
  $(".withdraw-dialog input").first().focus();
}


