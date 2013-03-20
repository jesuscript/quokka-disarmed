_.extend(Template.bet_inputs_area,{
  created: function(){
    Session.set("current_stake", 0);
  },
  rendered: function(){
    $("#bet-inputs-area .numeric-input").numeric();
  }
});

Template.bet_inputs_area.helpers({
  current_stake: function(){
    return Session.get("current_stake");
  },
  range_size: function(){
    return "CODE ME";
  },
  chance_to_win: function(){
    return "CODE ME"
  },
  reward: function(){
    return "CODE ME";
  }
});


