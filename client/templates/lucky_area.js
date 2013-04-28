(function(){
  _.extend(Template.lucky_area, {
    created: function(){
      Session.set("lucky_area_visible", false);
    },
    rendered: function(){
      handleSpinning();
    }
  });

  //Template.lucky_area.preserve(["#lucky-area"]);

  Template.lucky_area.helpers({
    spinning: function(){
      return Session.get("lucky_area_spinning") ||
        Session.get("bet") && Session.get("bet").status == "submitted"; 
    },
    lucky_number: function(){
      var bet = Session.get("bet");
      
      if(!Session.get("lucky_area_spinning") && (bet && bet.status == "processed")){
        return bet.result.lucky_number;
      }
    },
    area_class: function(){ // TODO try out my memorise thingy
      var status = Session.get("bet") && Session.get("bet").status;
      var visible = Session.get("lucky_area_visible");

      if(status == "new"){
        if(visible){
          setTimeout(function(){
            Session.set("lucky_area_visible", false);
          }, 500);
          return "animated-hide";
        }else{
          return "hidden-d";
        }
      }
      if(status == "submitted" || Session.get("lucky_area_spinning")){
        Session.set("lucky_area_visible", true);
        return "animated-show";
      }
      if(status == "processed") return "";
    }
  });


  function handleSpinning(){
    var min_spin_time = 500;
    var spinned_for = 0;
    var spin_delay = 50;
    var bet = Session.get("bet");

    var spin = function(){
      var bet_in = Session.get("bet");
      if(spinned_for < min_spin_time || (bet_in && bet_in.status == "submitted")){
        $(".spinning-number").text(Math.floor(Math.random()*101));
        spinned_for += spin_delay;
      }else{
        Session.set("lucky_area_spinning", false); // stop spinning
      }
    }

    if(!Session.get("lucky_area_spinning") && bet && bet.status == "submitted"){
      spin();
      Session.set("lucky_area_spinning", true);
    }
  }
})();
