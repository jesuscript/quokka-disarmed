Template.activity.created = function(){
  Session.set("activity_tmpl_size", "max");
  Session.set("activity_tmpl_mode", "activity");
};

Template.activity.helpers({
  size: function(){ return Session.get("activity_tmpl_size");},
  
  mode: function(){ return Session.get("activity_tmpl_mode");},
  
  activityMode: function(){
    return Session.get("activity_tmpl_mode") === "activity";
  },

  chatMsgs: function(){
    return _.map(Collections.ChatMsgs.find({}, {sort: {timestamp: -1}}).fetch(), function(msg){
      return _.extend(msg, {time: moment(msg.timestamp).format("HH:mm")});
    });
  },
  
  activity: function(){
    return _.map(Collections.Activity.find({}, {sort: {timestamp: -1}}).fetch(), function(item){
      return _.extend(item, {time: moment(item.timestamp).format("HH:mm:ss")});
    });
  }
});

var throttledChat = function() {
  var $input = $(".chat-input");
  if ($input.val().length !== 0 && $input.val().length <= 130) {
    Meteor.call("submitChatMsg", $input.val());
    $input.val("").focus();
  }
};

var throttleClick = _.throttle(throttledChat, 1000);
Template.activity.events({
  "click .maximise": function(e){
    Session.set("activity_tmpl_size", "max");
  },

  "click .minimise": function(e){
    Session.set("activity_tmpl_size", "min");
  },

  "click .activity-btn": function(e){
    if (Session.get("activity_tmpl_mode") === "activity") {
      var expand = (Session.get("activity_tmpl_size") === "min") ? "max" : "min";
      Session.set("activity_tmpl_size", expand);
    }
    Session.set("activity_tmpl_mode", "activity");
  },

  "click .chat-btn": function(e){
    if (Session.get("activity_tmpl_mode") === "chat") {
      var expand = (Session.get("activity_tmpl_size") === "min") ? "max" : "min";
      Session.set("activity_tmpl_size", expand);
    }
    Session.set("activity_tmpl_mode", "chat");
  },

  "submit form": function(e){
    e.preventDefault();
    throttleClick();
  }
});


Template.activity.preserve([".terminal", ".chat-panel"]);

// for fading in activity items line by line
Template.activity.preserve({
  '.activity-item[id]': function (node) { return node.id; }
});

// for fading in chat items line by line
Template.activity.preserve({
  '.message[id]': function (node) { return node.id; }
});
