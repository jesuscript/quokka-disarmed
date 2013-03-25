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
      return getRangeSize();
    },
    chance_to_win: function(){
      return Math.round(getChanceToWin() * 10000) / 100 + "%";
    },
    reward: function(){
      return Math.round(Session.get("current_stake") * (1 / getChanceToWin(true)) * 100000000) /
        100000000; //TODO create a function to do that shared between client and server
    }
  });

  Template.bet_inputs_area.events({
    "keyup #bet-inputs-stake": function(){
      Session.set("current_stake", parseFloat($("#bet-inputs-stake").val(),10));
    },
    "click .bet-btn": function(){
      $("#bet-inputs-stake").hide("slide", {direction: "left"}, 200, function(){
        $("#bet-inputs-stake-indicator").show("slide", {direction: "left"}, 200);

        $("#bet-inputs-area .bet-btn").parent().fadeOut(400, function(){
          Meteor.call("submitBet", Session.get("current_player_id"), Session.get("current_stake"),
                      BetSlider.getSliderVals(), function(err, result){
                        Session.set("bet", {
                          status: "processed",
                          result: result
                        });

                        $("#bet-inputs-area .new-game-btn").parent().fadeIn(400);
                      });
        });
      });
    },
    "click .new-game-btn": function(){
      $("#bet-inputs-stake-indicator").hide("slide", {direction: "left"}, 200, function(){
        $("#bet-inputs-stake").show("slide", {direction: "left"}, 200);
        
        $("#bet-inputs-area .new-game-btn").parent().fadeOut(400,function(){
          Session.set("bet",{
            status: "new"
          });
          Session.set("current_stake", 0);
          
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

  function getRangeSize(){
    var vals = BetSlider.getSliderVals();
    return vals ? vals.max - vals.min + 1 : 0;
  }

  function getChanceToWin(computing_reward){
    var vals = BetSlider.getSliderVals();

    if(vals){
      return getRangeSize() / (computing_reward ? 100 : 101)
    }else{
      return 0;
    }
  }
})();


