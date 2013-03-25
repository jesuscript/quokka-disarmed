(function(){
  Template.navbar.helpers({
    signed_in: function(){
      return db.current_player() !== undefined;
    },
    username: function(){
      return db.current_player().username; 
    },
    balance: function(){
      return db.current_player().balance; //TODO: flasing; only update if stopped spinning
    }
  });

  Template.navbar.events({
    "click .signup-btn": function(){
      $("body").append(Meteor.render( Template.signup_dialog ));
    },
    "click .signin-btn": function(){
    }
  });


  Template.signup_dialog.rendered = function(){
    $("#signup-dialog .username").focus();
  };

  Template.signup_dialog.events({
    "click .cancel, click .shroud": function(e, tmpl){
      removeDialog(tmpl);
    },
    "click .submit-btn": function(e, tmpl){ //TODO keypress Enter submits
      Meteor.call("signup", $("#signup-dialog .username").val(), function(err,res){
        Session.set("current_player_id", res);
        Meteor.subscribe("current_player", res);
        removeDialog(tmpl);
      });
    }
  });

  function removeDialog(tmpl){
      var node = tmpl.firstNode;

      $(node).addClass("fade-out");
      
      setTimeout(function(){
        Spark.finalize(node);
        $(node).remove();
      }, 500);
  }
})();
