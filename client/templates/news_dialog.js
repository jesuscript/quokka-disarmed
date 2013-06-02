Template.news_dialog.news = function () {
  var news = Collections.News.find().fetch();
  return news;
};

Template.news_dialog.events({
  "click #cancel, click .close, click .shroud": function(e,tmpl){
    TemplateHelpers.removeDialog(tmpl);
  }  
});

Handlebars.registerHelper('dateFormat', function(context) {
  return moment(context).format("dddd, MMMM DD, YYYY");
});