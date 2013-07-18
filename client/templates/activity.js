Template.activity.rendered = function() {
  // Ignore me... I'm here because I'm the last thing drawn.
  function logRenders() {
    _.each(Template, function (template, name) {
      var oldRender = template.rendered;
      var counter = 0;

      template.rendered = function () {
        console.log(name, "render count: ", ++counter);
        oldRender && oldRender.apply(this, arguments);
      };
    });
  }

  logRenders();
}