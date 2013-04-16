(function(){
  _.extend(Template.bet_inputs_area,{
    created: function(){
      Session.set("current_stake", 0);
      Session.set("bet", {
        status: "new"
      });
    },
    rendered: function(){
      $("#bet-inputs-area .numeric-input").numeric();
      $("#bet-inputs-stake").focus(function(){
        $("#bet-inputs-stake").select().one("mouseup", function(e){
          e.preventDefault();
          $(this).unbind("mouseup");
        });
      });
    }
  });

  Template.bet_inputs_area.helpers({
    current_stake: function(){
      return Session.get("current_stake");
    },
    range: function(){
      var vals = BetSlider.getSliderVals();
      if(vals){
        return vals.min + ", " + vals.max;
      }else{
        return "";
      }
    },
    range_size: function(){
      var vals = BetSlider.getSliderVals();
      return vals ? vals.max - vals.min + 1 : 0;
    },
    max_reward: function(){
      var range = BetSlider.getSliderVals();

      if(range){
        var claim = Game.claim(Session.get("current_stake"), range.min, range.max);
        
        return Math.round(claim * 100000000) / 100000000;
      }
    }
  });

  Template.bet_inputs_area.events({
    "keyup #bet-inputs-stake": function(){
      Session.set("current_stake", parseFloat($("#bet-inputs-stake").val(),10));
    },
    "click .bet-btn": function(){
      $("#bet-inputs-stake").hide("slide", {direction: "left"}, 200, function(){
        var range = BetSlider.getSliderVals();
          
        $("#bet-inputs-stake-indicator").show("slide", {direction: "left"}, 200);

        $("#bet-inputs-area .bet-btn").parent().addClass("fade-out");

        Meteor.call(
          "submitBet",
          Session.get("current_stake"),
          range.min,
          range.max,
          function(err, response){
            //codez here?
          }
        );

      });
    },
    "click .new-game-btn": function(){
      $("#bet-inputs-stake-indicator").hide("slide", {direction: "left"}, 200, function(){
        $("#bet-inputs-stake").show("slide", {direction: "left"}, 200);
        
        $("#bet-inputs-area .new-game-btn").parent().fadeOut(400,function(){
          Session.set("bet",{
            status: "new"
          });
          
          $("#bet-inputs-area .bet-btn").parent().fadeIn(400);
        });
      });
    }
  });

  Meteor.methods({
    submitBet: function(){
      Session.set("bet",{
        status: "submitted"
      });
    }
  });

})();


