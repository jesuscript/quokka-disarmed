Template.activity.created = function(){
  Session.set("activity_tmpl_size", "max");
  Session.set("activity_tmpl_mode", "activity");
};

Template.activity.helpers({
  size: function(){ return Session.get("activity_tmpl_size");},
  mode: function(){ return Session.get("activity_tmpl_mode");},
  activityMode: function(){
    return Session.get("activity_tmpl_mode") == "activity";
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

Template.activity.events({
  "click .maximise": function(e){
    Session.set("activity_tmpl_size", "max");
  },
  "click .minimise": function(e){
    Session.set("activity_tmpl_size", "min");
  },
  "click .activity-btn": function(e){
    Session.set("activity_tmpl_mode", "activity");
  },
  "click .chat-btn": function(e){
    Session.set("activity_tmpl_mode", "chat");
  },
  "submit form": function(e,tmpl){
    var $input = $(tmpl.find(".chat-input"));
    
    Meteor.call("submitChatMsg", $input.val());

    $input.val("").focus();
    e.preventDefault();
  }
});

Template.activity.preserve([".terminal", ".chat-panel"]);
