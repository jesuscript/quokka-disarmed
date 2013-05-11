_.extend(TemplateHelpers, {
  removeDialog: function(tmpl, callback){
    var node = tmpl.firstNode;

    $(node).addClass("fade-out");
    
    setTimeout(function(){
      Spark.finalize(node);
      $(node).remove();

      callback && callback();
    }, 500);
  },
  bindKeyboard: function(tmpl){
    // won't trigger a click event on a template :(

    /*
    var keyElMap = {};

    _.each(tmpl.findAll("[data-key]"),function(el){
      var $el = $(el);
      keyElMap[$el.attr("data-key")] = $el;
    });

    $(tmpl.firstNode).keypress(function(e){

      
      keyElMap[e.charCode] && keyElMap[e.charCode].click();
    });
    */
  }
});
