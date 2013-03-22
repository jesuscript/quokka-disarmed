(function(){
  _.extend(Template.bet_inputs_area,{
    created: function(){
      Session.set("current_stake", 0);
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
      return 0;
    },
    range_size: function(){
      return getRangeSize();
    },
    chance_to_win: function(){
      return Math.round(getChanceToWin() * 10000) / 100 + "%";
    },
    reward: function(){
      return Math.round(Session.get("current_stake") * (1 / getChanceToWin()) * 100) / 100;
    }
  });

  Template.bet_inputs_area.events({
    "keyup #bet-inputs-stake": function(){
      Session.set("current_stake", parseFloat($("#bet-inputs-stake").val(),10));
    }
  });

  function getRangeSize(){
    var vals = BetSlider.getSliderVals();
    return vals ? vals.max - vals.min + 1 : 0;
  }

  function getChanceToWin(){
    var vals = BetSlider.getSliderVals();

    if(vals){
      return getRangeSize() / 101
    }else{
      return 0;
    }
  }
})();


