Template.header.helpers({
    alert: function() {
        var alertMsg = Collections.Flags.findOne({type: 'alert'});
        return alertMsg && alertMsg.message.length;
    },
    message: function() {
        return Collections.Flags.findOne({type: 'alert'}).message;
    }
});

